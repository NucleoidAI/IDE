import { ReactComponent as NewTabSVG } from "./NewTab.svg";

function NewTab({ fill, disabled }) {
  return (
    <NewTabSVG
      style={{ width: 21, height: 21 }}
      fill={disabled ? "#6a7178" : fill}
    />
  );
}

export default NewTab;
