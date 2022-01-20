import Prettier from "prettier-standalone";

import React, { useEffect, useRef, useState } from "react";

import Editor from "../../components/Editor";

export default function EditorWidget() {
  const editorRef = useRef();

  
  function getEditorText() {
    console.log(editorRef.current.editor.getValue());
  }

  function onBlurHandler() {
    console.log(editorRef.current.editor.getValue());
  }

  return (
    <>
      <Editor
        value={`function example()\n{\n\tconsole.log("a")\n}`}
        onBlurHandler={onBlurHandler}
        ref={editorRef}
      />
      <button onClick={() => getEditorText()}>get text</button>
    </>
  );
}
