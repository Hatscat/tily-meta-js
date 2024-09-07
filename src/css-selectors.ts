/**
 * create a css id selector
 * @example
 * // return "#a"
 * id("a")
 */
export function id(id: string) {
  return `#${id}`;
}

/**
 * create a css class selector
 * @example
 * // return ".a"
 * className("a")
 */
export function className(_className: string) {
  return `.${_className}`;
}

/**
 * join multiple selectors
 * @example
 * // return "a,#b,.c"
 * selectorList("a", id("b"), className("c"))
 */
export function selectorList(...selectors: string[]) {
  return selectors.join(",");
}

/**
 * create a css attribute selector
 * @example
 * // return "a[href]"
 * attribute("a", "href")
 */
export function attribute(selector: string, attribute: string) {
  return `${selector}[${attribute}]`;
}

/**
 * create a css hover selector
 * @example
 * // return "a:hover"
 * hover("a")
 */
export function hover(selector: string) {
  return `${selector}:hover`;
}

/**
 * create a css after selector
 * @example
 * // return "a::after"
 * after("a")
 */
export function after(selector: string) {
  return `${selector}::after`;
}

/**
 * create a css direct children selector
 * @example
 * // return "a>*"
 * directChildren("a")
 * @example
 * // return "a>b"
 * directChildren("a", "b")
 */
export function directChildren(selector: string, childSelector = "*") {
  return `${selector}>${childSelector}`;
}
