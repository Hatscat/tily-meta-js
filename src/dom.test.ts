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
import { templateExpression } from "./operations.ts";

Deno.test("element()", () => {
  assertEquals(element("div", {}), "<div></div>");

  assertEquals(
    element("body", {
      tagProps: { id: "b" },
      closed: false,
      children: [
        element("div", {
          tagProps: { style: "width:50%" },
          children: [
            element("img", {
              tagProps: { src: "./icon.png" },
              closed: false,
            }),
            element("input", {
              tagProps: { name: "i", value: "test" },
              closed: false,
            }),
          ],
        }),
        element("div", {
          closed: false,
          children: element("span", {
            children: "Hello World!",
            closed: false,
          }),
        }),
      ],
    }),
    "<body id=b><div style=width:50%><img src=./icon.png><input name=i value=test></div><div><span>Hello World!",
  );

  assertEquals(
    element("div", { children: "test", as: "string" }),
    "'<div>test</div>'",
  );

  assertEquals(
    element("div", { children: "test", as: "templateLiteral" }),
    "`<div>${test}</div>`",
  );

  assertEquals(
    element("div", {
      children: [
        "",
        element("p", { children: templateExpression("test") }),
      ],
      as: "templateLiteral",
    }),
    "`<div><p>${test}</p></div>`",
  );
});

Deno.test("setInnerHtml()", () => {
  assertEquals(
    setInnerHtml(
      "elementId",
      element("a", { tagProps: { href: "#" }, children: "link" }),
    ),
    "elementId.innerHTML='<a href=#>link</a>'",
  );

  assertEquals(
    setInnerHtml(
      "b",
      [
        element("p", {
          children: [
            "Hello ",
            element("span", { children: "World", closed: false }),
            "!",
          ],
        }),
      ],
    ),
    "b.innerHTML='<p>Hello <span>World!</p>'",
  );

  assertEquals(
    setInnerHtml(
      "b",
      element("p", { children: "Hello '\"`World`\"'!", closed: true }),
    ),
    "b.innerHTML=`<p>Hello '\"\\`World\\`\"'!</p>`",
  );
  assertEquals(
    setInnerHtml(
      "elementId",
      element("a", {
        tagProps: { href: "#" },
        children: templateExpression("link"),
      }),
      { isTemplateLiteral: true },
    ),
    "elementId.innerHTML=`<a href=#>${link}</a>`",
  );
});

Deno.test("setOuterHtml()", () => {
  assertEquals(
    setOuterHtml(
      "elementId",
      element("a", { tagProps: { href: "#" }, children: "link" }),
    ),
    "elementId.outerHTML='<a href=#>link</a>'",
  );
  assertEquals(
    setOuterHtml(
      "elementId",
      element("a", {
        tagProps: { href: "#" },
        children: templateExpression("link"),
      }),
      { isTemplateLiteral: true },
    ),
    "elementId.outerHTML=`<a href=#>${link}</a>`",
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
