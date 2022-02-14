import Path from "../Path.js";

test("Split Path prefix, suffix", () => {
  const { prefix, suffix } = Path.split("/questions/reviews/{rev3}/items");
  expect(prefix).toEqual("/questions/reviews/{rev3}");
  expect(suffix).toEqual("items");
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

  const resultSameValue = Path.isUsed(
    paths,
    "/questions",
    "reviews",
    "reviews"
  );

  const resultValueNull = Path.isUsed(paths, "/questions", "reviews", "");

  const resultValueUsed = Path.isUsed(
    paths,
    "/questions",
    "reviews",
    "reviews2"
  );

  const resultValueUnUsed = Path.isUsed(
    paths,
    "/questions",
    "reviews",
    "invalid"
  );

  expect(resultSameValue).toEqual(false);
  expect(resultValueNull).toEqual(true);
  expect(resultValueUsed).toEqual(true);
  expect(resultValueUnUsed).toEqual(false);
});
