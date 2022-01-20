import EditableScrollList from "../components/EditableScrollList";
import ScrollList from "../components/ScrollList";

import React, { useRef } from "react";

export default function TreeView({ editable }) {
  const apiList = ["a", "b", "c", "d", "e"];

  const ref = useRef([]);

  function textChangeHandler() {
    Object.keys(ref.current).forEach((key) => {
      console.log(ref.current[key].value);
    });
  }

  function handleEditApiList() {
    Object.keys(ref.current).forEach((key) => {
      console.log(ref.current[key].value);
    });
  }

  return (
    <>
      {editable ? (
        <ScrollList list={apiList} />
      ) : (
        <EditableScrollList
          list={apiList}
          handler={textChangeHandler}
          ref={ref}
        />
      )}
      <button onClick={() => handleEditApiList()}>get button</button>
    </>
  );
}
