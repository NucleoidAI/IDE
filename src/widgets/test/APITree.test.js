import APITree from "../APITree";
import Adapter from "enzyme-adapter-react-16";
import NonExpandableTreeItem from "../../components/NonExpandableTreeItem";
import React from "react";
import State from "../../state";

import { useNucleoidStore } from "../../Context/providers/NucleoidStoreProvider";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });
jest.mock("../../Context/providers/NucleoidStoreProvider");

// https://stackoverflow.com/questions/58070996/how-to-fix-the-warning-uselayouteffect-does-nothing-on-the-server
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useLayoutEffect: jest.requireActual("react").useEffect,
}));

test("List nested APIs", () => {
  const state = State.init();
  const api = state.get("nucleoid.api");
  api["/"] = { get: {} };
  api["/questions"] = { get: {} };
  useNucleoidStore.mockReturnValue([state]);

  const wrapper = shallow(<APITree />);
  const root = wrapper.find(NonExpandableTreeItem).first();

  const questions = root.children().at(1);
  expect(root.prop("label")).toEqual("/");
  expect(questions.prop("label")).toEqual("/questions");
});

test("List APIs with methods", () => {
  const state = State.init();
  const api = state.get("nucleoid.api");
  api["/"] = { get: {}, post: {} };
  api["/questions"] = { get: {}, post: {} };
  useNucleoidStore.mockReturnValue([state]);

  const wrapper = shallow(<APITree />);
  const root = wrapper.find(NonExpandableTreeItem).first();
  expect(root.prop("label")).toEqual("/");
  let children = root.children();
  expect(children.at(0).html().includes("GET")).toEqual(true);
  expect(children.at(1).html().includes("POST")).toEqual(true);

  const questions = root.children().at(2);
  expect(questions.prop("label")).toEqual("/questions");

  children = questions.children();
  expect(children.at(0).html().includes("GET")).toEqual(true);
  expect(children.at(1).html().includes("POST")).toEqual(true);
});
