import Adapter from "enzyme-adapter-react-16";
import ArrowIcon from "../Arrow";
import React from "react";
import Enzyme, { shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

test("Create arrows with direction", () => {
  const up = shallow(<ArrowIcon up />);
  expect(up.name()).toEqual("Memo(ForwardRef(KeyboardArrowUpIcon))");

  const down = shallow(<ArrowIcon down />);
  expect(down.name()).toEqual("Memo(ForwardRef(KeyboardArrowDownIcon))");

  const right = shallow(<ArrowIcon right />);
  expect(right.name()).toEqual("Memo(ForwardRef(KeyboardArrowRightIcon))");

  const left = shallow(<ArrowIcon left />);
  expect(left.name()).toEqual("Memo(ForwardRef(KeyboardArrowLeftIcon))");
});
