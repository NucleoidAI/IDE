import React, { forwardRef } from "react";
import { TextField } from "@material-ui/core";

const SummaryForm = forwardRef((props, ref) => {
  return (
    <form style={{ marginLeft: 24, marginRight: 24 }}>
      <TextField label={"Summary"} fullWidth ref={ref} />
      <TextField label={"Description"} multiline fullWidth rows={3} />
    </form>
  );
});

export default SummaryForm;
