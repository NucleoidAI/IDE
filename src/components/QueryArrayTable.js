import React from "react";
import { v4 as uuid } from "uuid";
import { DataGrid } from "@mui/x-data-grid"; //eslint-disable-line

export default function QueryArrayTable({ json }) {
  const generateRowsandColumns = (json, isRow) => {
    const columns = [];
    if (typeof json[0] === "object") {
      if (isRow) {
        //const arr = [];
        // json.forEach((item) => Object.keys(item).forEach((key) => typeof item[key] === 'object' && ));

        return json;
      } else {
        const obj = json[0];
        Object.keys(obj).forEach((key) => {
          columns.push({ field: key, headerName: key });
        });
      }
    } else {
      if (isRow) {
        return json.map((item) => {
          return {
            id: uuid(),
            item,
          };
        });
      } else {
        columns.push(
          { field: "id", headerName: "ID" },
          { field: "item", headerName: "item" }
        );
      }
    }

    return columns;
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        columns={generateRowsandColumns(json)}
        rows={generateRowsandColumns(json, true)}
        pageSize={6}
        visibleColumns={"id"}
        rowsPerPageOptions={[6]}
        disableSelectionOnClick
      />
    </div>
  );
}
