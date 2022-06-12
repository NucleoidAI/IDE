import { TextField } from "@mui/material";
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
        <>
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
            rows={2}
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
        </>
      );
    }
  }
);

export default SummaryForm;
