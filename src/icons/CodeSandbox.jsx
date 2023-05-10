import { ReactComponent as CodeSandboxSVG } from "./CodeSandbox.svg";

function CodeSandbox({ fill, disabled }) {
  return (
    <CodeSandboxSVG
      style={{ width: 25, height: 25 }}
      fill={disabled ? "#6a7178" : fill}
    />
  );
}

export default CodeSandbox;
