import { Text } from "./primitives.ts";
import { Primitive, Printable } from "./utils/type.ts";

/**
 * addition(s)
 * @example
 * // returns "1.2+3+true"
 * add(1.2, "3", true)
 */
export function add(...values: Printable[]): string {
  return values.join("+");
}

/**
 * subtraction(s)
 * @example
 * // returns "1.2-3-true"
 * sub(1.2, "3", true)
 */
export function sub(...values: Printable[]): string {
  return values.join("-");
}

/**
 * multiplication(s)
 * @example
 * // returns "1.2*3*true"
 * mul(1.2, "3", true)
 */
export function mul(...values: Printable[]): string {
  return values.join("*");
}

/**
 * division(s)
 * @example
 * // returns "1.2/3/true"
 * div(1.2, "3", true)
 */
export function div(...values: Printable[]): string {
  return values.join("/");
}

/**
 * modulo(s)
 * @example
 * // returns "1.2%3%true"
 * add(1.2, "3", true)
 */
export function mod(...values: Printable[]): string {
  return values.join("%");
}

/**
 * power(s)
 * @example
 * // returns "1.2**3**true"
 * pow(1.2, "3", true)
 */
export function pow(...values: Printable[]): string {
  return values.join("**");
}

/**
 * logical AND(s)
 * @example
 * // returns "1.2&&3&&true"
 * and(1.2, "3", true)
 */
export function and(...values: Printable[]): string {
  return values.join("&&");
}

/**
 * logical OR(s)
 * @example
 * // returns "1.2||2||3||true"
 * or(1.2, "3", true)
 */
export function or(...values: Printable[]): string {
  return values.join("||");
}

/**
 * logical NOT
 * @example
 * // returns "!1"
 * not(1)
 */
export function not(value: Printable): string {
  return `!${value}`;
}

/**
 * bitwise AND(s)
 * @example
 * // returns "1.2&3&true"
 * band(1.2, "3", true)
 */
export function band(...values: Printable[]): string {
  return values.join("&");
}

/**
 * bitwise OR(s)
 * @example
 * // returns "1.2|3|true"
 * bor(1.2, "3", true)
 */
export function bor(...values: Printable[]): string {
  return values.join("|");
}

/**
 * bitwise NOT
 * @example
 * // returns "~1"
 * bnot(1)
 */
export function bnot(value: Printable): string {
  return `~${value}`;
}

/**
 * bitwise XOR(s)
 * @example
 * // returns "1.2^3^true"
 * xor(1.2, "3", true)
 */
export function xor(...values: Printable[]): string {
  return values.join("^");
}

/**
 * left shift(s)
 * @example
 * // returns "1.2<<3<<true"
 * leftShift(1.2, "3", true)
 */
export function leftShift(...values: Printable[]): string {
  return values.join("<<");
}

/**
 * right shift(s)
 * @example
 * // returns "1.2>>3>>true"
 * rightShift(1.2, "3", true)
 */
export function rightShift(...values: Printable[]): string {
  return values.join(">>");
}

/**
 * less than comparison(s)
 * @example
 * // returns "1.2<3<true"
 * isLess(1.2, '3', true)
 */
export function isLess(...values: Printable[]): string {
  return values.join("<");
}

/**
 * greater than comparison(s)
 * @example
 * // returns "1.2>3>true"
 * isGreater(1.2, '3', true)
 */
export function isGreater(...values: Printable[]): string {
  return values.join(">");
}

/**
 * equal comparison(s)
 * @example
 * // returns "1.2==3==true"
 * isEqual(1.2, '3', true)
 */
export function isEqual(...values: Printable[]): string {
  return values.join("==");
}

/**
 * different comparison(s)
 * @example
 * // returns "1.2^3^true"
 * isDifferent(1.2, '3', true)
 */
export function isDifferent(...values: Printable[]): string {
  return values.join("^");
}

/**
 * ternary condition
 * @example
 * // return "a>b?1:2"
 * ifElse("a>b", 1, 2)
 */
export function ifElse(
  condition: Printable,
  ifTrue: Printable,
  ifFalse: Printable,
): string {
  return `${condition}?${ifTrue}:${ifFalse}`;
}

/**
 * for loop
 * @example
 * // return "for(a=3;a--;log())compute()"
 * loop({ init: assign("a", 3), condition: decrement("a"), body: "compute()", body2: "log()" })
 */
export function loop(
  { init, condition, body, body2 }: {
    condition: string | string[];
    body?: string | string[];
    body2?: string | string[];
    init?: string | string[];
  },
) {
  return `for(${init ?? ""};${condition};${body2 ?? ""})${body ?? ""}`;
}

/**
 * increment a variable
 * @example
 * // return "a++"
 * increment("a")
 * @example
 * // return "a+=2"
 * increment("a", 2)
 * @example
 * // return "++a"
 * increment("a", 1, { before: true })
 */
export function increment(
  variable: string,
  step: Primitive = 1,
  { before } = { before: false },
): string {
  if (step === 1) {
    return before ? `++${variable}` : `${variable}++`;
  }
  return `${variable}+=${step}`;
}

/**
 * decrement a variable
 * @example
 * // return "a--"
 * decrement("a")
 * @example
 * // return "a-=2"
 * decrement("a", 2)
 * @example
 * // return "--a"
 * decrement("a", 1, { before: true })
 */
export function decrement(
  variable: string,
  step: Primitive = 1,
  { before } = { before: false },
): string {
  if (step === 1) {
    return before ? `--${variable}` : `${variable}--`;
  }
  return `${variable}-=${step}`;
}

/**
 * convert a value to boolean type
 * @example
 * // return "!!1"
 * castBoolean(1)
 */
export function castBoolean(value: Primitive): string {
  return `!!${value}`;
}

/**
 * convert a value to number type
 * @example
 * // return "+true"
 * castNumber(true)
 */
export function castNumber(value: Primitive): string {
  return `+${value}`;
}

/**
 * convert a value to integer
 * @example
 * // return "1.2|0"
 * castInt(1.2)
 */
export function castInt(value: Primitive): string {
  return `${value}|0`;
}

/**
 * round a float number
 * @example
 * // return "1.2+.5|0"
 * round(1.2)
 */
export function round(value: Primitive): string {
  return `${value}+.5|0`;
}

/**
 * negate a value
 * @example
 * // return "-a"
 * minus("a")
 */
export function minus(value: Primitive): string {
  return `-${value}`;
}

/**
 * Function constructor
 * @example
 * // return "Function('a','b','return(a+b)')"
 * funcConstructor(["a", "b"], output(add("a", "b")))
 */
export function funcConstructor(args: string[], body: string) {
  return `Function(${args.reduce((argsStr, a) => argsStr + Text(a) + ",", "")}${
    Text(body)
  })`;
}

/**
 * String template literal
 * @example
 * // returns "`hello ${name}!`"
 * templateLiteral(["hello ", "name", "!"])
 */
export function templateLiteral(
  parts: string[],
): string {
  let result = "";
  for (let i = 0; i < parts.length; i += 2) {
    result += parts[i] +
      (i + 1 < parts.length ? "${" + parts[i + 1] + "}" : "");
  }
  return "`" + result + "`";
}

/**
 * container for arbitrary expressions
 * @example
 * // returns "3*(1+2)"
 * mul(3, group(add(1, 2)))
 * @example
 * // returns "(a,b,c)"
 * group(["a", "b", "c"])
 * @example
 * // returns "{a;b}"
 * group(statements("a", "b", "c"), "}")
 */
export function group(content: Printable, border: ")" | "}" = ")"): string {
  return `${border === ")" ? "(" : "{"}${content}${border}`;
}
