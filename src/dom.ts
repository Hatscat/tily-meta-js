import { findAvailableQuote, kebabCase } from "./utils/string.ts";
import { ReservedVariables } from "./variables.ts";

/**
 * the argument name for inline event
 */
export const INLINE_EVENT_ARG_NAME = "event";

type ElementProps = {
  tagProps?: { [key: string]: string | undefined };
  children?: string | string[];
  closed?: boolean;
};

/**
 * generates a HTML Element
 * @example
 * // returns "<div><span id=s style=width:50%>Hello World!</div>"
 * element("div", {
 *   children: element("span", {
 *     tagProps: { id: "s", style: "width:50%" },
 *     children: "Hello World!",
 *   }),
 *   closed: true,
 * })
 */
export function element(
  tagName: string,
  { tagProps, children = "", closed = false }: ElementProps,
): string {
  const tag = `<${tagName}${
    tagProps
      ? " " + Object.entries(tagProps).map(([key, value]) =>
        value ? `${key}=${value}` : key
      ).join(" ")
      : ""
  }>`;
  const child = Array.isArray(children) ? children.join("") : children;

  return `${tag}${child}${closed === true ? `</${tagName}>` : ""}`;
}

/**
 * set the innerHTML of an Element
 * @param element a variable name referring to an HTML element, it can be the element ID according to the "Named access on the Window object" rule of the HTML specification.
 * @example
 * // returns "elementId.innerHTML='<a href=#>link'"
 * setInnerHtml("elementId", element("a", { tagProps: { href: "#" }, children: "link" }))
 */
export function setInnerHtml(
  element: string,
  html: string | string[],
): string {
  const innerHtml = Array.isArray(html) ? html.join("") : html;
  const quote = findAvailableQuote(innerHtml);

  if (quote) {
    return `${element}.innerHTML=${quote}${innerHtml}${quote}`;
  }
  return `${element}.innerHTML='${innerHtml.replaceAll("'", "\\'")}'`;
}

/**
 * set the outerHTML of an Element
 * @param element a variable name referring to an HTML element, it can be the element ID according to the "Named access on the Window object" rule of the HTML specification.
 * @example
 * // returns "elementId.outerHTML='<a href=#>link</a>'"
 * setOuterHtml("elementId", element("a", { tagProps: { href: "#" }, children: "link", closed: true }))
 */
export function setOuterHtml(
  element: string,
  html: string | string[],
): string {
  const outerHtml = Array.isArray(html) ? html.join("") : html;
  const quote = findAvailableQuote(outerHtml);

  if (quote) {
    return `${element}.outerHTML=${quote}${outerHtml}${quote}`;
  }
  return `${element}.outerHTML='${outerHtml.replaceAll("'", "\\'")}'`;
}

/**
 * increment the innerHTML of an Element
 * @param element a variable name referring to an HTML element, it can be the element ID according to the "Named access on the Window object" rule of the HTML specification.
 * @example
 * // returns "elementId.innerHTML+='<p>hey!</p>'"
 * incrementInnerHtml("elementId", element("p", { children: "hey", closed: true }))
 */
export function incrementInnerHtml(
  element: string,
  html: string | string[],
): string {
  const innerHtml = Array.isArray(html) ? html.join("") : html;
  const quote = findAvailableQuote(innerHtml);

  if (quote) {
    return `${element}.innerHTML+=${quote}${innerHtml}${quote}`;
  }
  return `${element}.innerHTML+='${innerHtml.replaceAll("'", "\\'")}'`;
}

/**
 * append some HTML to an Element
 * @param element a variable name referring to an HTML element, it can be the element ID according to the "Named access on the Window object" rule of the HTML specification.
 * @example
 * // returns "elementId.outerHTML+='<p>hey!</p>'"
 * incrementOuterHtml("elementId", element("p", { children: "hey", closed: true }))
 */
export function incrementOuterHtml(
  element: string,
  html: string | string[],
): string {
  const outerHtml = Array.isArray(html) ? html.join("") : html;
  const quote = findAvailableQuote(outerHtml);

  if (quote) {
    return `${element}.outerHTML+=${quote}${outerHtml}${quote}`;
  }
  return `${element}.outerHTML+='${outerHtml.replaceAll("'", "\\'")}'`;
}

/**
 * swap 2 HTML Element positions
 * @param element1 a variable name referring to an HTML element, it can be the element ID according to the "Named access on the Window object" rule of the HTML specification.
 * @param element2 another variable name referring to an HTML element.
 * @example
 * // returns "[elementId.outerHTML,$.outerHTML]=[($=ev.target).outerHTML,elementId.outerHTML]"
 * swapElements("elementId", "ev.target")
 */
export function swapElements(
  element1: string,
  element2: string,
  tmpVarName: string = ReservedVariables.TemporaryVar,
): string {
  return `[${element1}.outerHTML,${tmpVarName}.outerHTML]=[(${tmpVarName}=${element2}).outerHTML,${element1}.outerHTML]`;
}

/**
 * generates a CSS Stylesheet ready to be inserted in a Style tag (or nested)
 * @example
 * // returns "*:hover{padding-left:4}div{display:flex;justify-content:center}.center{text-align:center}@media(orientation:portrait){#root>*{flex-direction:column}}"
 * formatStylesheet({
 *  "*:hover": { paddingLeft: 4 },
 *  div: { display: "flex", justifyContent: "center" },
 *  ".center": { textAlign: "center" },
 *  "@media(orientation:portrait)": formatStylesheet({
 *    "#root>*": {
 *      flexDirection: "column",
 *    },
 *  }),
 * })
 */
export function formatStylesheet(
  stylesheet: { [selector: string]: Record<string, string | number> | string },
): string {
  return Object.keys(stylesheet).reduce((css, selector) => {
    const style = stylesheet[selector];
    return css +
      `${selector}{${typeof style === "string" ? style : formatStyle(style)}}`;
  }, "");
}

/**
 * format style in CSS format
 * @example
 * // returns "display:flex;justify-content:center;width:32"
 * formatStyle({ display: "flex", justifyContent: "center", width: 32 })
 */
export function formatStyle(
  style: Record<string, string | number>,
): string {
  return Object.entries(style).map(([key, value]) =>
    `${kebabCase(key)}:${value}`
  ).join(";");
}

/**
 * helper to generate a CSS font value
 * @example
 * // returns "12px A"
 * font(12)
 * @example
 * // returns "50% A"
 * font(50, "%")
 * @example
 * // returns "2em Arial"
 * font("2", "em", "Arial")
 */
export function font(
  sizeValue: number | string,
  sizeUnit = "px",
  family = "A",
): string {
  return `${sizeValue}${sizeUnit} ${family}`;
}
