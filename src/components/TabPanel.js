import Box from "@mui/material/Box";

const TabPanel = (props) => {
  const { children, value, index } = props;

  return (
    <>
      {value === index && (
        <Box sx={{ pl: 2, height: "100%", bgcolor: "#424242d1" }}>
          {children}
        </Box>
      )}
    </>
  );
};

export default TabPanel;
