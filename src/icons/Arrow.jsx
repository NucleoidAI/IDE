import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";

const style = {
  fill: "#212121",
};

function Arrow({ up, down, right, left }) {
  return up ? (
    <KeyboardArrowUpIcon style={style} />
  ) : down ? (
    <KeyboardArrowDownIcon style={style} />
  ) : right ? (
    <KeyboardArrowRightIcon style={style} />
  ) : left ? (
    <KeyboardArrowLeftIcon style={style} />
  ) : null;
}

export default Arrow;
