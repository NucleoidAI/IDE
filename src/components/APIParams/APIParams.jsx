import AddIcon from "@mui/icons-material/Add";
import ParamTable from "../ParamTable";

import { Box, Fab } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const APIParams = forwardRef(({ types }, ref) => {
  const { paramsRef, addParams } = ref;
  const [params, setParams] = useState(paramsRef.current);

  useEffect(() => {
    setParams(paramsRef.current);
  }, [paramsRef]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params, paramsRef]);

  const handleAddParams = () => {
    const id = Date.now().toString();
    const newParam = {
      id,
      in: "query",
      type: "string",
      required: true,
    };
    setParams((prevParams) => [...prevParams, newParam]);
  };

  addParams.current = handleAddParams;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85%",
        p: 2,
      }}
    >
      <ParamTable types={types} params={params} setParams={setParams} />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Fab size={"small"} onClick={handleAddParams}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
});

export default APIParams;
