import AddIcon from "@material-ui/icons/Add";
import { Context } from "../context";
import { v4 as uuid } from "uuid";
import { Divider, Fab, Menu, MenuItem } from "@material-ui/core";
import React, { useContext } from "react";

function AddList({ list, type }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useContext(Context)[1];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Fab size={"small"} onClick={handleClick}>
        <AddIcon />
      </Fab>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {list.map((item) =>
          item === "|" ? (
            <Divider key={uuid()} />
          ) : (
            <MenuItem
              key={item}
              onClick={() => {
                setAnchorEl(null);
                dispatch({
                  type,
                  payload: item.toUpperCase(),
                });
              }}
            >
              {item}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
}

export default AddList;
