import "./QueryResult.css";
import ReactJsonView from "react-json-view";

function QueryResult({ json }) {
  return (
    <ReactJsonView
      src={json}
      name={null}
      theme={"grayscale:inverted"}
      displayDataTypes={false}
      displayObjectSize={false}
      quotesOnKeys={false}
      style={{ border: 0, overflowY: "scroll" }}
      iconStyle={"circle"}
    />
  );
}

export default QueryResult;
