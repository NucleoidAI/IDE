import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

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
