import Button from "@mui/material/Button";
import React from "react";
import StarBorder from "@mui/icons-material/StarBorder";

const StarUsOnGithub = ({ color }) => {
  return (
    <Button
      size="large"
      startIcon={<StarBorder fontSize="large" />}
      sx={{
        textTransform: "none",
        fontSize: "1rem",
        color: color || "white",
      }}
      onClick={() =>
        window.open("https://github.com/NucleoidJS/Nucleoid", "_blank")
      }
    >
      Star us on Github
    </Button>
  );
};

export default StarUsOnGithub;
