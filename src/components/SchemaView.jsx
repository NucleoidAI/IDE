import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { TreeView } from "@mui/lab";
import { compile as cmp } from "../widgets/APIDialog/Context";
import { compile } from "./Schema";
import { compile as mapSchema } from "../utils/Map";

export default function SchemaView({ schema }) {
  const [expanded, setExpanded] = React.useState([]);
  const [sc] = React.useState({ ...cmp(schema) });

  const map = mapSchema(sc);
  const expandList = [];

  const handleToggle = (event, ids) => {
    setExpanded(ids);
  };

  const handleExpandClick = () => {
    setExpanded([...expandList]);
  };

  React.useEffect(() => {
    handleExpandClick();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TreeView
      defaultCollapseIcon={<RemoveCircleOutlineIcon />}
      defaultExpandIcon={<AddCircleOutlineIcon />}
      onNodeToggle={handleToggle}
      expanded={expanded}
    >
      {compile(false, map, sc, null, expandList)}
    </TreeView>
  );
}
