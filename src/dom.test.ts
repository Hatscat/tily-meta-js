import { assertEquals } from "../dev-deps.ts";
import {
  element,
  font,
  formatStyle,
  formatStylesheet,
  incrementInnerHtml,
  incrementOuterHtml,
  setInnerHtml,
  setOuterHtml,
  swapElements,
} from "./dom.ts";

Deno.test("element()", () => {
  assertEquals(element("div", {}), "<div>");

  assertEquals(
    element("body", {
      tagProps: { id: "b" },
      children: [
        element("div", {
          tagProps: { style: "width:50%" },
          children: [
            element("img", {
              tagProps: { src: "./icon.png" },
            }),
            element("input", { tagProps: { name: "i", value: "test" } }),
          ],
          closed: true,
        }),
        element("div", {
          children: element("span", {
            children: "Hello World!",
          }),
        }),
      ],
    }),
    "<body id=b><div style=width:50%><img src=./icon.png><input name=i value=test></div><div><span>Hello World!",
  );
});

Deno.test("setInnerHtml()", () => {
  assertEquals(
    setInnerHtml(
      "elementId",
      element("a", { tagProps: { href: "#" }, children: "link" }),
    ),
    "elementId.innerHTML='<a href=#>link'",
  );

  assertEquals(
    setInnerHtml(
      "b",
      [
        element("p", { children: "Hello " }),
        element("span", { children: "World" }),
        "!",
      ],
    ),
    "b.innerHTML='<p>Hello <span>World!'",
  );

  assertEquals(
    setInnerHtml(
      "b",
      element("p", { children: "Hello '\"`World`\"'!", closed: true }),
    ),
    "b.innerHTML='<p>Hello \\'\"`World`\"\\'!</p>'",
  );
});

Deno.test("setOuterHtml()", () => {
  assertEquals(
    setOuterHtml(
      "elementId",
      element("a", { tagProps: { href: "#" }, children: "link" }),
    ),
    "elementId.outerHTML='<a href=#>link'",
  );
});

Deno.test("incrementInnerHtml()", () => {
  assertEquals(
    incrementInnerHtml(
      "elementId",
      element("p", { children: "hey!", closed: true }),
    ),
    "elementId.innerHTML+='<p>hey!</p>'",
  );
});

Deno.test("incrementOuterHtml()", () => {
  assertEquals(
    incrementOuterHtml(
      "elementId",
      element("p", { children: "hey!", closed: true }),
    ),
    "elementId.outerHTML+='<p>hey!</p>'",
  );
});

Deno.test("swapElements()", () => {
  assertEquals(
    swapElements("a", "b"),
    "[a.outerHTML,$.outerHTML]=[($=b).outerHTML,a.outerHTML]",
  );
});

Deno.test("formatStyle()", () => {
  assertEquals(
    formatStyle({ display: "flex", justifyContent: "center", width: 32 }),
    "display:flex;justify-content:center;width:32",
  );
});

Deno.test("formatStylesheet()", () => {
  assertEquals(
    formatStylesheet({
      "*:hover": { paddingLeft: 4 },
      div: { display: "flex", justifyContent: "center" },
      ".center": { textAlign: "center" },
      "@media(orientation:portrait)": formatStylesheet({
        "#root>*": {
          flexDirection: "column",
        },
      }),
    }),
    "*:hover{padding-left:4}div{display:flex;justify-content:center}.center{text-align:center}@media(orientation:portrait){#root>*{flex-direction:column}}",
  );
});

Deno.test("font()", () => {
  assertEquals(font(12), "12px A");
  assertEquals(font(50, "%"), "50% A");
  assertEquals(font("2", "em", "Arial"), "2em Arial");
});
