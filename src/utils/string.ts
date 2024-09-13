export function findAvailableQuote(
  text: string,
  quotes: Array<"'" | '"' | "`"> = ["'", '"', "`"],
): "'" | '"' | "`" | undefined {
  return quotes.filter((q) => !text.includes(q))[0];
}

export function kebabCase(text: string): string {
  return text.trim().replaceAll(
    /(?:\s|_)+|([A-Z]+)/g,
    (_, chars = "", i) => (i ? "-" : "") + chars.toLowerCase(),
  ).replaceAll(/\-+/g, "-").replaceAll(/^\-|\-$/g, "");
}

export function shortestText(...texts: string[]): string {
  return texts.sort((a, b) => a.length - b.length)[0];
}
