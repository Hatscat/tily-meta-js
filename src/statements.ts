import { removeFalsyItems } from "./utils/array.ts";
import type { Primitive, Printable } from "./utils/type.ts";
import { ReservedVariables } from "./variables.ts";

type FunctionDefinition = {
  name?: string;
  args?: Printable[];
  body: Printable;
  safe?: boolean;
};

/**
 * declare a function
 * @example
 * // returns "a=_=>(42)"
 * defineFunc({ name: "a", body: 42 })
 * @example
 * // returns "_=>42"
 * defineFunc({ body: 42, safe: false })
 * @example
 * // returns "f=(a,b)=>b=a**a,a+b"
 * defineFunc({ name: "f", args: ["a", "b"], body: [assign("b", pow("a", "a")), add("a", "b")], safe: false })
 */
export function defineFunc(
  { name, args = [], body, safe = true }: FunctionDefinition,
): string {
  const enclosedArgs = args.length === 0
    ? ReservedVariables.EmptyArg
    : args.length === 1 && !String(args[0]).includes("=")
    ? args[0]
    : `(${args})`;
  const declaration = name ? `${name}=` : "";

  return /while|for|if|switch|return|[{;]/.test(String(body))
    ? `${declaration}${enclosedArgs}=>{${body}}`
    : safe
    ? `${declaration}${enclosedArgs}=>(${body})`
    : `${declaration}${enclosedArgs}=>${body}`;
}

/**
 * execute a function
 * @example
 * // returns "a(2)"
 * execFunc("a", 2)
 * @example
 * // returns "a`hello`"
 * execFunc("a", "hello", { isTemplateLiteral: true })
 * @example
 * // returns "((x,y)=>x-y)(1,2)"
 * execFunc(defineFunc({ args: ["x", "y"], body: sub("x", "y"), safe: false }), [1, 2])
 */
export function execFunc(
  name: string,
  args?: Primitive | Primitive[],
  { isTemplateLiteral } = { isTemplateLiteral: false },
): string {
  const wrappedName = /function\b|=/.test(name) ? `(${name})` : name;

  if (!args) {
    return `${wrappedName}()`;
  }
  if (isTemplateLiteral) {
    return `${wrappedName}\`${args}\``;
  }
  return `${wrappedName}(${args})`;
}

/**
 * set a value to one or several variable(s)
 * @example
 * // returns "a=42"
 * assign("a", 42)
 * @example
 * // returns "a=b=c=42"
 * assign("a", "b", "c", 42)
 * @example
 * // returns "a+=2"
 * assign("a", add("a", 2))
 */
export function assign(key: string, value: Primitive): string;
export function assign(
  key: string,
  ...values: [...string[], Primitive]
): string;
export function assign(
  key: string,
  ...values: [Primitive] | [...string[], Primitive]
): string {
  const value = String(values[0]);
  const remainingValues = values.length === 1
    ? null
    : values.length === 2
    ? [values[1]] as [Primitive]
    : values.slice(1) as [...string[], Primitive];

  const escapedKey = key.replace(/[\^$.*+?|\[\]]/g, "\\$&");
  // https://regex101.com/r/1D24WE/1
  const matches = new RegExp(`^${escapedKey}(\\*\\*|<<|>>|[+\\-*\\/%&|])(.+)`)
    .exec(
      value,
    );

  if (matches) {
    return `${key}${matches[1]}=${
      remainingValues ? assign(matches[2], ...remainingValues) : matches[2]
    }`;
  }
  return `${key}=${
    remainingValues ? assign(value, ...remainingValues) : value
  }`;
}

/**
 * access to a property value by static key
 * @example
 * // returns "[1,2,3].length"
 * prop(List(1,2,3), "length")
 * @example
 * // returns "{a:{b:2}}.a.b"
 * prop(Record({ a: { b: 2 } }), "a", "b")
 */
export function prop(...keys: string[]): string {
  return keys.join(".");
}

/**
 * access to a property value by dynamic key
 * @example
 * // returns "[1,2,3][0]"
 * dynamicProp(List(1,2,3), 0)
 * @example
 * // returns "{a:{b:2}}['a']['b']"
 * dynamicProp(Record({ a: { b: 2 } }), Text`a`, Text`b`)
 */
export function dynamicProp(
  obj: string,
  ...keys: Array<string | number>
): string {
  return obj + keys.map((k) => `[${k}]`);
}

/**
 * return a value
 * @example
 * // returns "Function(return(42)"
 * funcConstructor([], output(42))
 */
export function output(value: Printable, { safe } = { safe: true }): string {
  return safe ? `return(${value})` : `return ${value}`;
}

/**
 * isolate statements with semicolons (;)
 * @example
 * // returns "a();b();c()"
 * expressions("a()", "b()", "c()")
 */
export function statements(...sts: Printable[]): string {
  return removeFalsyItems(sts).join(";");
}

/**
 * isolate expressions with commas (,)
 * @example
 * // returns "a(),b(),42"
 * expressions("a()", "b()", 42)
 */
export function expressions(...exps: Printable[]): string {
  return removeFalsyItems(exps).join(",");
}

/**
 * early return when the condition is true
 * @example
 * // returns "if(a<42)return"
 * abortIf(isLess("a", 42))
 */
export function abortIf(condition: Printable): string {
  return `if(${condition})return`;
}

/**
 * statement condition
 * @example
 * // returns "if(a)b()"
 * ifThen("a", "b()")
 * @example
 * // returns "if(a){b();c()}"
 * ifThen("a", statements("b()", "c()"))
 */
export function ifThen(condition: Printable, then: Printable): string {
  return `if(${condition})${/;/.test(String(then)) ? `{${then}}` : then}`;
}
