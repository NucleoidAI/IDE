import { useLayoutContext } from "../../Context/providers/layoutContextProvider";
import { Backdrop, CircularProgress } from "@mui/material";

const BackdropDialog = () => {
  const [layout] = useLayoutContext();

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={layout.backdrop}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropDialog;
