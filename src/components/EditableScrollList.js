import { TextField } from "@material-ui/core";
import React, { forwardRef } from "react";

const EditableScrollList = forwardRef(({ list, handler }, ref) => {
  return (
    <div>
      {list && ref
        ? list.map((item, index) => {
            return (
              <li key={index}>
                <TextField
                  inputRef={(el) => {
                    ref.current[item] = el;
                    ref.current[item].value = item;
                  }}
                  onChange={handler}
                />
              </li>
            );
          })
        : "List is empty"}
    </div>
  );
});

export default EditableScrollList;
