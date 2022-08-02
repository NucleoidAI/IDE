import ArrowIcon from "../Arrow";
import React from "react";
import { render, screen } from "@testing-library/react";

test("Create arrows with direction", () => {
  render(<ArrowIcon up />);
  screen.getByTestId(/KeyboardArrowUpIcon/i);

  render(<ArrowIcon down />);
  screen.getByTestId(/KeyboardArrowDownIcon/i);

  render(<ArrowIcon left />);
  screen.getByTestId(/KeyboardArrowLeftIcon/i);

  render(<ArrowIcon right />);
  screen.getByTestId(/KeyboardArrowRightIcon/i);
});
