import { deepCopy } from "../DeepCopy";

test("Copy nested object", () => {
  const nestedObject = {
    name: "Oğuz",
    adress: { title: "home", info: { city: "Ankara", code: 6000 } },
  };

  const copiedObject = deepCopy(nestedObject);

  expect(nestedObject).toEqual(copiedObject);
});

test("Check it's not the same object", () => {
  const nestedObject = {
    name: "Oğuz",
    adress: { title: "home", info: { city: "Ankara", code: 34000 } },
  };

  const copiedObject = deepCopy(nestedObject);

  nestedObject.name = "Kamil";
  nestedObject.adress.info.city = "İstanbul";

  expect(nestedObject).not.toEqual(copiedObject);
});
