import { assertEquals } from "../dev-deps.ts";
import { ifElse, isEqual } from "./operations.ts";
import { List, Text } from "./primitives.ts";
import {
  generateTmpVarName,
  initVariables,
  provideTmpVarNames,
  replaceAllTmpVarNames,
} from "./variables.ts";

Deno.test("provideTmpVarNames()", () => {
  // Given
  const anInput = {
    state: "",
    element: {
      canvas: "",
      header: "",
    },
    function: {
      navToHome: "",
      loop: {
        render: "",
        draw: "",
      },
    },
  };

  // When
  const result = provideTmpVarNames(anInput);

  // Then
  const expectedResult = {
    state: "$$state$$",
    element: {
      canvas: "$$element.canvas$$",
      header: "$$element.header$$",
    },
    function: {
      navToHome: "$$function.navToHome$$",
      loop: {
        render: "$$function.loop.render$$",
        draw: "$$function.loop.draw$$",
      },
    },
  };

  assertEquals(result, expectedResult);
  assertEquals(result.state, expectedResult.state);
  assertEquals(result.element.canvas, expectedResult.element.canvas);
  assertEquals(result.function.loop.draw, expectedResult.function.loop.draw);
});

Deno.test("replaceAllTmpVarNames()", () => {
  // Given
  const aSourceCode = `$$global$$ = "abc";
  $$state$$ = { $$key.answer$$: 42, $$key.other1$$: "73", $$key.other2$$: null }
  $$state$$.$$key.answer$$ ? true : false
  return $$state$$`;
  // All AVAILABLE_CHAR_FOR_VARIABLES except the 2 last ones ('y' and 'z')
  const someUnavailableChars = "abcdefghijklmnopqrstuvwx".split(
    "",
  );

  // When
  const result1 = replaceAllTmpVarNames(aSourceCode);
  const result2 = replaceAllTmpVarNames(aSourceCode, someUnavailableChars);

  // Then
  assertEquals(
    result1,
    `c = "abc";
  a = { b: 42, d: "73", e: null }
  a.b ? true : false
  return a`,
  );
  assertEquals(
    result2,
    `ay = "abc";
  y = { z: 42, az: "73", a0: null }
  y.z ? true : false
  return y`,
  );
});

Deno.test("initVariables()", () => {
  // Given
  const varNames = {
    state: {
      user: {
        id: "userId",
        email: "userEmail",
        plan: {
          type: "userPlanType",
          price: "userPlanPrice",
        },
      },
    },
    score: "score",
    items: "items",
  };

  const varValues = {
    state: {
      user: {
        id: "73",
        email: Text("foo@bar.com"),
        plan: {
          type: Text("free"),
          price: "0",
        },
      },
    },
    score: "42",
    items: List(),
  };

  // When
  const result = initVariables(varNames, varValues);

  // Then
  assertEquals(
    result,
    "userId=73;userEmail='foo@bar.com';userPlanType='free';userPlanPrice=0;score=42;items=[]",
  );
});

Deno.test("provideTmpVarNames() + initVariables() + replaceAllTmpVarNames()", () => {
  // Given
  const varValues = {
    state: {
      user: {
        id: "73",
        email: Text("foo@bar.com"),
        plan: {
          type: Text("free"),
          get price(): string {
            return ifElse(
              isEqual(
                generateTmpVarName("state.user.plan.type"),
                Text("free"),
              ),
              "0",
              "100",
            );
          },
        },
      },
    },
    score: "42",
    items: List(),
  };

  // When
  const varNames = provideTmpVarNames(varValues);
  const initScript = initVariables(varNames, varValues);
  const result = replaceAllTmpVarNames(initScript);

  // Then
  assertEquals(
    result,
    "b=73;c='foo@bar.com';a='free';d=a=='free'?0:100;e=42;f=[]",
  );
});
