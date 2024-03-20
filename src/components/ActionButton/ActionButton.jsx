import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { Fab } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function ActionButton({ onClick, type, color }) {
  const Icon = () => {
    switch (type) {
      case "done":
        return <DoneIcon />;
      case "delete":
        return (
          <DeleteIcon
            sx={{ color: color ? color : (theme) => theme.palette.cancelIcon }}
          />
        );
      case "close":
        return (
          <CloseIcon
            sx={{ color: color ? color : (theme) => theme.palette.cancelIcon }}
          />
        );
      case "play":
        return (
          <PlayArrowIcon
            sx={{ color: color ? color : (theme) => theme.palette.doneIcon }}
          />
        );
    }
  };

  return (
    <Fab
      variant="button"
      size="small"
      sx={{ color: (theme) => theme.palette.doneIcon }}
      onClick={onClick}
    >
      <Icon />
    </Fab>
  );
}

export default ActionButton;
