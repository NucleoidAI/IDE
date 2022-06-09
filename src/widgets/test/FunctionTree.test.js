import Adapter from "enzyme-adapter-react-16";
import FunctionTree from "../FunctionTree";
import NonExpandableFunctionTreeItem from "../../components/NonExpandableFunctionTreeItem";
import React from "react";
import State from "../../state";
import { useContext } from "../../Context/providers/contextProvider";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });
jest.mock("../../Context/providers/contextProvider");

test("List nested functions", () => {
  const state = State.init();
  const functions = state.get("nucleoid.functions");

  functions.push({
    path: "/getInfo",
    params: [],
    type: "FUNCTION",
  });
  functions.push({
    path: "/users/getUser",
    params: ["user"],
    type: "FUNCTION",
  });
  useContext.mockReturnValue([state]);

  const wrapper = shallow(<FunctionTree functions={functions} />);
  const root = wrapper.find(NonExpandableFunctionTreeItem).first();
  const child1 = root.children().first();
  const child2 = root.children().at(1);
  const child3 = child1.children().first();

  expect(root.prop("nodeId")).toEqual("/");
  expect(child1.prop("nodeId")).toEqual("/users/");
  expect(child2.prop("nodeId")).toEqual("/getInfo");
  expect(child3.prop("nodeId")).toEqual("/users/getUser");
});
