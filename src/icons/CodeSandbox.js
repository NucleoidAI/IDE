import { ReactComponent as CodeSandboxSVG } from "./CodeSandbox.svg";

function CodeSandbox({ fill }) {
  return <CodeSandboxSVG style={{ width: 25, height: 25 }} fill={fill} />;
}

export default CodeSandbox;
