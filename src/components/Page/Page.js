import Box from "@mui/material/Box";
import React from "react";
import { Helmet } from "react-helmet"; //eslint-disable-line

const Page = ({ title, children }) => {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Nucleoid IDE - {title}</title>
      </Helmet>
      {children}
    </Box>
  );
};

export default Page;
