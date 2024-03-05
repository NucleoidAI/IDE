import AddIcon from "@mui/icons-material/Add";
import ParamTable from "../ParamTable";

import { Box, Fab } from "@mui/material";
import { forwardRef, useRef } from "react";

const APIParams = forwardRef(({ types }, paramsRef) => {
  const addParams = useRef();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85%",
        p: 2,
      }}
    >
      <ParamTable types={types} ref={{ paramsRef, addParams }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab size={"small"} onClick={() => addParams.current()}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
});

export default APIParams;
