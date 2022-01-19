import React from "react";
import { TextField } from "@material-ui/core";

export default function EditableScrollList({list}) {
  return (
    <div>
      {list
        ? list.map((item, index) => {
            return (
              <li key={index}>
                <TextField value={item} />
              </li>
            );
          })
        : "list is empty"}
    </div>
  );
}
