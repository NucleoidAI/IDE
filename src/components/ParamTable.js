import "./ParamTable.css";
import { DataGrid } from "@mui/x-data-grid";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import TypeMenu from "./TypeMenu";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, IconButton, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "none",
    width: 900,
  },
}));

const ParamTable = ({ params, removeParam, map }) => {
  const classes = useStyles();

  const columns = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <TextField
            defaultValue={param.value}
            onChange={(event) => (map[id].name = event.target.value)}
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
        return <TypeMenu id={id} type={param.value} edit />;
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
            onChange={(event) => (map[id].required = event.target.checked)}
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
            onChange={(event) => (map[id].description = event.target.value)}
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
          <IconButton onClick={() => removeParam(id)}>
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
      rows={Object.values(params || {})}
      hideFooter
      disableSelectionOnClick
    />
  );
};

export default ParamTable;

//Object.values(params || {})
