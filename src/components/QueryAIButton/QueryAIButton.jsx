import AutoModeIcon from "@mui/icons-material/AutoMode";
import { Fab } from "@mui/material";
import actions from "../../actions";
import { useContext } from "../../context/context";

function QueryAIButton() {
  const [, dispatch] = useContext();

  const handleClickOpen = () => {
    dispatch({
      type: actions.openAIDialog,
      payload: { page: "query" },
    });
  };

  return (
    <Fab size={"small"} onClick={handleClickOpen}>
      <AutoModeIcon />
    </Fab>
  );
}

export default QueryAIButton;