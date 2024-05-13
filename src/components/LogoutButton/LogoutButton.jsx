import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";

function LogoutButton({ onLogout }) {
  const handleLogout = () => {
    storage.remove("oauth.token");
    onLogout && onLogout();
  };

  return (
    <Button variant="gray" onClick={handleLogout} startIcon={<LogoutIcon />}>
      Logout
    </Button>
  );
}

export default LogoutButton;
