import { v4 as uuid } from "uuid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function ParamView({ params }) {
  params = params || [];

  return (
    <Table size={"small"}>
      <colgroup>
        <col style={{ width: "50%" }} />
        <col style={{ width: "50%" }} />
      </colgroup>
      <TableHead>
        <TableRow>
          <TableCell>Parameter</TableCell>
          <TableCell>Data Type</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {params.map((param) => (
          <TableRow key={uuid()}>
            <TableCell>{param.name}</TableCell>
            <TableCell>{param.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ParamView;
