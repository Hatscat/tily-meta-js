import { assertEquals } from "../dev-deps.ts";
import {
  add,
  decrement,
  funcConstructor,
  group,
  increment,
  loop,
  templateLiteral,
} from "./operations.ts";
import { assign, execFunc, output } from "./statements.ts";

Deno.test("loop()", () => {
  const x = "x", y = "y", z = "z";
  assertEquals(
    loop({
      init: [
        assign(x, 0),
        assign(y, 3),
      ],
      condition: [increment(x), decrement(y)],
      body: [assign(z, add(x, y)), execFunc("console.log", z)],
      body2: [assign("style", "'#color'"), execFunc("draw", [x, y, z])],
    }),
    "for(x=0,y=3;x++,y--;style='#color',draw(x,y,z))z=x+y,console.log(z)",
  );
});

Deno.test("group()", () => {
  assertEquals(group("1+2"), "(1+2)");
  assertEquals(group("1+2", ")"), "(1+2)");
  assertEquals(group("a=3;return", "}"), "{a=3;return}");
});

Deno.test("funcConstructor()", () => {
  assertEquals(
    funcConstructor([], output(42, { safe: false })),
    "Function('return 42')",
  );
  assertEquals(
    funcConstructor(["a", "b"], output(add("a", "b"))),
    "Function('a','b','return(a+b)')",
  );
});

Deno.test("templateLiteral()", () => {
  assertEquals(
    templateLiteral(["hello ", "name", "!"]),
    "`hello ${name}!`",
  );
  assertEquals(
    templateLiteral(["", "var"]),
    "`${var}`",
  );
  assertEquals(
    templateLiteral(["<p>Value: ", "var1", "/", "var2", "</p>"]),
    "`<p>Value: ${var1}/${var2}</p>`",
  );
});
