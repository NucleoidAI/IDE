import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

function LogoutButton() {
  const handleLogout = () => {
    console.log("Logout");
  };
  return (
    <Button variant="gray" onClick={handleLogout} startIcon={<LogoutIcon />}>
      Logout
    </Button>
  );
}

export default LogoutButton;
