import { element } from "./dom.ts";
import { Text } from "./primitives.ts";
import { execFunc, prop } from "./statements.ts";

/**
 * helper to generate the function to register your service worker
 * @example
 * // returns "navigator.serviceWorker?.register('/sw.js')"
 * registerServiceWorker()
 */
export function registerServiceWorker(path = Text("/sw.js")): string {
  return execFunc(prop("navigator", "serviceWorker?", "register"), path);
}

/**
 * helper to generate the HTML Element that link your web manifest
 * @example
 * // returns "<link rel=manifest href=m.webmanifest>"
 * manifestLink()
 */
export function manifestLink(path = "m.webmanifest"): string {
  return element("link", {
    tagProps: { rel: "manifest", href: path },
    closed: false,
  });
}

/**
 * helper to generate the viewport meta tag
 * @example
 * // returns "<meta name=viewport content=width=device-width,initial-scale=1>"
 * viewportMeta()
 */
export function viewportMeta(
  content = "width=device-width,initial-scale=1",
): string {
  return element("meta", {
    tagProps: { name: "viewport", content },
    closed: false,
  });
}

/**
 * helper to generate the HTML Doctype and the html tag
 * @example
 * // returns "<!DOCTYPE html><html lang=en>"
 * htmlDoctype()
 */
export function htmlDoctype(lang = "en"): string {
  return [
    element("!DOCTYPE", { tagProps: { html: undefined }, closed: false }),
    element("html", { tagProps: { lang }, closed: false }),
  ].join("");
}

/**
 * helper to generate the title tag
 * @example
 * // returns "<title>example</title>"
 * titleTag("example")
 */
export function titleTag(title: string): string {
  return element("title", { children: title, closed: true });
}
