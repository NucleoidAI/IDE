import APITree from "../APITree";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import State from "../../state";
import { TreeItem } from "@mui/lab";
import { useContext } from "../../context";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });
jest.mock("../../context");

test("List nested APIs", () => {
  const state = State.init();
  const api = state.get("nucleoid.api");
  api["/"] = { get: {} };
  api["/questions"] = { get: {} };
  useContext.mockReturnValue([state]);

  const wrapper = shallow(<APITree />);
  const root = wrapper.find(TreeItem).first();

  const questions = root.children().at(1);
  expect(root.prop("label")).toEqual("/");
  expect(questions.prop("label")).toEqual("/questions");
});

test("List APIs with methods", () => {
  const state = State.init();
  const api = state.get("nucleoid.api");
  api["/"] = { get: {}, post: {} };
  api["/questions"] = { get: {}, post: {} };
  useContext.mockReturnValue([state]);

  const wrapper = shallow(<APITree />);
  const root = wrapper.find(TreeItem).first();
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
