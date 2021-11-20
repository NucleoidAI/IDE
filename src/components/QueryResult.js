import "./QueryResult.css";
import ReactJsonView from "react-json-view";

function QueryResult({ json }) {
  return (
    <ReactJsonView
      src={json}
      theme={"grayscale:inverted"}
      displayDataTypes={false}
      displayObjectSize={false}
      quotesOnKeys={false}
      style={{ border: 0 }}
      iconStyle={"circle"}
    />
  );
}

export default QueryResult;
