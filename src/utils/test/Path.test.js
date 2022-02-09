import { checkPathUsed, splitPathPrefixAndSuffix } from "../Path.js";

test("Split Path prefix, suffix", () => {
  const result = splitPathPrefixAndSuffix("/questions/reviews/{rev3}/items");
  expect(result).toEqual(["/questions/reviews/{rev3}", "items"]);
});

test("Check path used?", () => {
  const paths = [
    "/",
    "/devices",
    "/questions",
    "/questions/reviews",
    "/questions/reviews2",
    "/questions/reviews/{rev3}",
    "/questions/reviews/{rev3}/items",
  ];

  const resultSameValue = checkPathUsed(
    paths,
    "/questions",
    "reviews",
    "reviews"
  );

  const resultValueNull = checkPathUsed(paths, "/questions", "reviews", "");

  const resultValueUsed = checkPathUsed(
    paths,
    "/questions",
    "reviews",
    "reviews2"
  );

  const resultValueUnUsed = checkPathUsed(
    paths,
    "/questions",
    "reviews",
    "gkhn"
  );

  expect(resultSameValue).toEqual(false);
  expect(resultValueNull).toEqual(true);
  expect(resultValueUsed).toEqual(true);
  expect(resultValueUnUsed).toEqual(false);
});
