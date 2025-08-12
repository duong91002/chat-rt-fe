import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  ...theme.mixins.toolbar,
}));
const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header DrawerHeader={DrawerHeader} />
      <Box component="main" sx={{ flexGrow: 1, p: isMobile ? 0.5 : 2 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
