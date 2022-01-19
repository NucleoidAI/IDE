import React from "react";

export default function ScrollList({ list }) {
  return (
    <div>
      {list
        ? list.map((item, index) => {
            return <li key={index}>{item}</li>;
          })
        : "list is empty"}
    </div>
  );
}
