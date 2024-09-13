import { assertEquals } from "../../dev-deps.ts";
import { findAvailableQuote, kebabCase, shortestText } from "./string.ts";

Deno.test("findAvailableQuote()", () => {
  assertEquals(findAvailableQuote("Hello World!"), "'");
  assertEquals(findAvailableQuote("Hello 'World'!"), '"');
  assertEquals(findAvailableQuote("Hello `World`!"), "'");
  assertEquals(findAvailableQuote('Hello "World"!'), "'");
  assertEquals(findAvailableQuote("Hello \"'World'\"!"), "`");
  assertEquals(findAvailableQuote("Hello \"'`World`'\"!"), undefined);
  assertEquals(findAvailableQuote("Hello 'World'!", ["'", "`"]), "`");
});

Deno.test("kebabCase()", () => {
  assertEquals(kebabCase("Hello World"), "hello-world");
  assertEquals(kebabCase("HelloWorld"), "hello-world");
  assertEquals(kebabCase("_hello_world"), "hello-world");
  assertEquals(kebabCase("  helloWorld  "), "hello-world");
  assertEquals(kebabCase("HELLO_WORLD"), "hello-world");
  assertEquals(kebabCase("helloVeryNiceWorld3"), "hello-very-nice-world3");
  assertEquals(
    kebabCase(" -_Hello_ - _Nice_-_World_ - _!_- "),
    "hello-nice-world-!",
  );
});

Deno.test("shortestText()", () => {
  assertEquals(shortestText("abc", "aaa", "zz", "abcd efg", "1234"), "zz");
});
