import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { TreeView } from "@mui/lab";
import { compile as cmp } from "../widgets/APIDialog/Context";
import { compile } from "./Schema";
import { compile as mapSchema } from "../utils/Map";

export default function SchemaView({ schema }) {
  /*
  if (schema !== undefined) {
    schema = cmp(schema);
    const map = mapSchema(schema);
    const root = schema[Object.keys(schema)[0]].id;

    return (
      <TreeView
        defaultCollapseIcon={<RemoveCircleOutlineIcon />}
        defaultExpandIcon={<AddCircleOutlineIcon />}
        defaultExpanded={[root]}
      >
        {compile(false, map, schema)}
      </TreeView>
    );
  }
  */
  return "schema test";
}
