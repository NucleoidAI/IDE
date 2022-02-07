import { TextField } from "@material-ui/core";
import React, { forwardRef } from "react";

const SummaryForm = forwardRef(
  (
    {
      summaryTextChangeHandler,
      descriptionTextChangeHandler,
      summaryText,
      descriptionText,
    },
    ref
  ) => {
    if (ref) {
      return (
        <form style={{ marginLeft: 24, marginRight: 24 }}>
          <TextField
            label={"Summary"}
            fullWidth
            inputRef={(el) => {
              if (el) {
                ref.current["Summary"] = el;
                ref.current["Summary"].value = summaryText;
              }
            }}
            onChange={() =>
              summaryTextChangeHandler && summaryTextChangeHandler()
            }
          />
          <TextField
            label={"Description"}
            multiline
            fullWidth
            rows={3}
            inputRef={(el) => {
              if (el) {
                ref.current["Description"] = el;
                ref.current["Description"].value = descriptionText;
              }
            }}
            onChange={() =>
              descriptionTextChangeHandler && descriptionTextChangeHandler()
            }
          />
        </form>
      );
    }
  }
);

export default SummaryForm;
