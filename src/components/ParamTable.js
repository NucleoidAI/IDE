import "./ParamTable.css";
import { DataGrid } from "@mui/x-data-grid";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";
import TypeMenu from "./TypeMenu";

import makeStyles from '@mui/styles/makeStyles';
import { v4 as uuid } from "uuid";

import { Checkbox, IconButton, TextField } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    width: 900,
  },
}));

const ParamTable = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { paramsRef, addParamRef } = ref;

  const [params, setParams] = React.useState(paramsRef);

  addParamRef.current = () => {
    const id = uuid();

    paramsRef[id] = {
      id: id,
      type: "string",
      required: true,
    };
    setParams({ ...paramsRef });
  };

  function removeParam(id) {
    delete paramsRef[id];
    //TODO: https://github.com/mui-org/material-ui-x/issues/2714 mui problem?
    setTimeout(() => {
      setParams({ ...paramsRef });
    });
  }

  const columns = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <TextField
            defaultValue={param.value}
            onChange={(event) => (params[id].name = event.target.value)}
          />
        );
      },
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      renderCell: (param) => {
        const { id } = param.row;
        return <TypeMenu ref={paramsRef} id={id} type={param.value} edit />;
      },
      flex: 1,
    },
    {
      field: "in",
      headerName: "Param",
      flex: 1,
      valueGetter: (param) => param.value || "query",
    },
    {
      field: "required",
      headerName: "Required",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <Checkbox
            checked={param.value}
            onChange={(event) =>
              (paramsRef[id].required = event.target.checked)
            }
          />
        );
      },
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <TextField
            defaultValue={param.value}
            onChange={(event) =>
              (paramsRef[id].description = event.target.value)
            }
            fullWidth
          />
        );
      },
      flex: 2,
    },
    {
      field: "action",
      headerName: " ",
      sortable: false,
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <IconButton onClick={() => removeParam(id)} size="large">
            <HighlightOffIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <DataGrid
      className={classes.root}
      columns={columns}
      rows={Object.values(paramsRef || {})}
      hideFooter
      disableSelectionOnClick
    />
  );
});

export default ParamTable;
