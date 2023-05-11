import AddIcon from "@mui/icons-material/Add";
import Fade from "@mui/material/Fade";
import React from "react";
import { v4 as uuid } from "uuid";
import { Divider, Fab, Menu, MenuItem } from "@mui/material";

function AddList(props) {
  const { list, clickEvent } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {list &&
          list.map((item) =>
            item === "|" ? (
              <Divider key={uuid()} />
            ) : (
              <MenuItem
                key={item}
                onClick={() => {
                  setAnchorEl(null);
                  clickEvent && clickEvent(item);
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
