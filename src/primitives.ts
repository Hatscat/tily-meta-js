import { findAvailableQuote } from "./utils/string.ts";
import { isRecord, Printable } from "./utils/type.ts";

/**
 * a short expression which is equal to `undefined`
 */
export const UNDEFINED = "[]._";

/**
 * a short expression which is equal to `Infinity`
 */
export const INFINITY = "1/0";

/**
 * a short expression which is equal to `true`
 */
export const TRUE = 1;

/**
 * a short expression which is equal to `false`
 */
export const FALSE = 0;

/**
 * a short expression to express "nothing"
 * @example
 * // returns "a?b:0"
 * ifElse("a", "b", NOTHING)
 */
export const NOTHING = 0;

/**
 * stringify a value, by adding quotes around it
 * @example
 * // return "'hello'"
 * Text`hello`
 * @example
 * // return '"hello 'world'!"'
 * Text("hello 'world'!")
 */
export function Text(value: Printable = ""): string {
  const quote = findAvailableQuote(String(value)) ?? "\\'";
  return `${quote}${value}${quote}`;
}

/**
 * put values in an array
 * @example
 * // returns "[1,2,3]"
 * List(1, 2, 3)
 */
export function List(...values: Printable[]): string {
  return `[${values}]`;
}

/**
 * put keys and values in an object
 * @example
 * // returns "{a:42,b:{c:[true,'yes']}}"
 * Record({ a: 42, b: { c: [ true, Text("yes") ] } })
 */
export function Record(obj: Record<string | number, unknown>): string {
  return Array.isArray(obj)
    ? `[${obj.map((value) => isRecord(value) ? Record(value) : String(value))}]`
    : `{${
      Object.entries(obj).reduce(
        (result: string[], [key, value]) =>
          result.concat(
            `${key}:${isRecord(value) ? Record(value) : String(value)}`,
          ),
        [],
      ).join(",")
    }}`;
}

/**
 * a short expression to test if a value is a `String`
 * @example
 * // returns "if(a.big)return"
 * abortIf(checkIfString("a", { safe: false }))
 */
export function checkIfString(
  value: Printable,
  { safe } = { safe: true },
): string {
  if (safe) {
    return `(${value}).big`;
  }
  return `${value}.big`;
}

/**
 * a short expression to test if a value is a `Number`
 * @example
 * // returns "if(a.toFixed)return"
 * abortIf(checkIfNumber("a", { safe: false }))
 */
export function checkIfNumber(
  value: Printable,
  { safe } = { safe: true },
): string {
  if (safe) {
    return `(${value}).toFixed`;
  }
  return `${value}.toFixed`;
}

/**
 * a short expression to test if a value is an `Array`
 * @example
 * // returns "if(a.pop)return"
 * abortIf(checkIfArray("a", { safe: false }))
 */
export function checkIfArray(
  value: Printable,
  { safe } = { safe: true },
): string {
  if (safe) {
    return `(${value}).pop`;
  }
  return `${value}.pop`;
}

/**
 * a short expression to test if a value is a `Function`
 * @example
 * // returns "if(a.call)return"
 * abortIf(checkIfFunction("a", { safe: false }))
 */
export function checkIfFunction(
  value: Printable,
  { safe } = { safe: true },
): string {
  if (safe) {
    return `(${value}).call`;
  }
  return `${value}.call`;
}

/**
 * a short expression to test if a value is a `TextNode`
 * @example
 * // returns "if(a.data)return"
 * abortIf(checkIfTextNode("a", { safe: false }))
 */
export function checkIfTextNode(
  value: Printable,
  { safe } = { safe: true },
): string {
  if (safe) {
    return `(${value}).data`;
  }
  return `${value}.data`;
}
