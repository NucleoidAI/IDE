import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { publish } from "@nucleoidai/react-event";
import { storage } from "@nucleoidjs/webstorage";
import { useNavigate } from "react-router-dom";
function LogoutButton({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.remove("oauth.token");
    const latestContext = storage.get("ide", "selected", "project");
    publish("USER", { login: false, id: null });
    if (latestContext.type === "CLOUD") {
      storage.remove("ide", "selected", "project");
      navigate("/new");
    }
    onLogout && onLogout();
  };

  return (
    <Button variant="gray" onClick={handleLogout} startIcon={<LogoutIcon />}>
      Logout
    </Button>
  );
}

export default LogoutButton;
