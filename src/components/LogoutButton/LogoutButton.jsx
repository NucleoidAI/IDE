import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";

function LogoutButton() {
  const handleLogout = () => {
    storage.remove("oauth.token");
    publish("USER_LOGGED_OUT");
  };
  return (
    <Button variant="gray" onClick={handleLogout} startIcon={<LogoutIcon />}>
      Logout
    </Button>
  );
}

export default LogoutButton;
