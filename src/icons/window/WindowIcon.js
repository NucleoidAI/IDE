import React from "react";
import { ReactComponent as WindowLargeSVG } from "./w-large.svg";
import { ReactComponent as WindowMediumSVG } from "./w-medium.svg";
import { ReactComponent as WindowSmallSVG } from "./w-small.svg";

export const WindowIconSmall = ({ disabled }) => {
  return (
    <WindowSmallSVG
      style={{ width: 15, height: 15, fill: disabled ? "#ebebeb" : "#545B64" }}
    />
  );
};

export const WindowIconMedium = ({ disabled }) => {
  return (
    <WindowMediumSVG
      style={{ width: 15, height: 15, fill: disabled ? "#ebebeb" : "#545B64" }}
    />
  );
};

export const WindowIconLarge = ({ disabled }) => {
  return (
    <WindowLargeSVG
      style={{ width: 15, height: 15, fill: disabled ? "#ebebeb" : "#545B64" }}
    />
  );
};
