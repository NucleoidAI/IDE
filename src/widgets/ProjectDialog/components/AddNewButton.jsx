import { Button, Stack, alpha } from "@mui/material";

const AddNewButton = ({ formArea, setFormArea }) => {
  return (
    formArea === "button" && (
      <Stack sx={{ p: 1.5, width: "100%" }}>
        <Button
          fullWidth={true}
          variant="contained"
          onClick={() => setFormArea("add")}
          sx={{
            width: "100%",
            fontSize: 18,
            borderRadius: 1,
            borderColor: "gray",
            borderWidth: 0.11,
            borderStyle: "solid",
            "&:hover": {
              borderRadius: 1,
              borderColor: (theme) => theme.palette.primary.main,
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity
                ),
            },
          }}
        >
          Add New Project
        </Button>
      </Stack>
    )
  );
};

export default AddNewButton;
