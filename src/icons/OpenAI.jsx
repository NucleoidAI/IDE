import { ReactComponent as OpenAISVG } from "./openai.svg";

function OpenAI({ width = 25, height = 25, fill = "#c3c5c8" }) {
  return <OpenAISVG style={{ width, height, fill }} />;
}

export default OpenAI;
