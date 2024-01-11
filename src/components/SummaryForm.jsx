import { TextField } from "@mui/material";

import React, { forwardRef } from "react";

const SummaryForm = forwardRef(
  ({ onSummaryChange, onDescriptionChange, summary, description }, ref) => {
    if (ref) {
      const handleSummaryChange = (event) => {
        onSummaryChange(event.target.value);
      };

      const handleDescriptionChange = (event) => {
        onDescriptionChange(event.target.value);
      };

      return (
        <>
          <TextField
            label={"Summary"}
            fullWidth
            inputRef={(el) => {
              if (el) {
                ref.current["Summary"] = el;
                ref.current["Summary"].value = summary;
              }
            }}
            onChange={handleSummaryChange}
          />
          <TextField
            label={"Description"}
            multiline
            fullWidth
            rows={2}
            inputRef={(el) => {
              if (el) {
                ref.current["Description"] = el;
                ref.current["Description"].value = description;
              }
            }}
            onChange={handleDescriptionChange}
          />
        </>
      );
    }
  }
);

export default SummaryForm;
