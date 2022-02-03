import Adapter from "enzyme-adapter-react-16";
import FunctionTree from "../FunctionTree";
import React from "react";
import State from "../../state";
import { TreeItem } from "@mui/lab";
import { useContext } from "../../context";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });
jest.mock("../../context");

test("List nested functions", () => {
  const state = State.init();
  const functions = state.get("nucleoid.functions");
  functions["/getInfo"] = {
    params: [],
    type: "FUNCTION",
  };
  functions["/users/getUser"] = {
    params: ["user"],
    type: "FUNCTION",
  };
  useContext.mockReturnValue([state]);

  const wrapper = shallow(<FunctionTree functions={functions} />);
  const root = wrapper.find(TreeItem).first();
  const child1 = root.children().first();
  const child2 = root.children().at(1);
  const child3 = child1.children().first();

  expect(root.prop("nodeId")).toEqual("/");
  expect(child1.prop("nodeId")).toEqual("/users/");
  expect(child2.prop("nodeId")).toEqual("/getInfo");
  expect(child3.prop("nodeId")).toEqual("/users/getUser");
});
