import DarkModeIcon from "@mui/icons-material/DarkMode";
import SunnyIcon from "@mui/icons-material/Sunny";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useColorScheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import DrawerList from "./DrawerList";
import MuiAppBar from "@mui/material/AppBar";

const drawerWidth = 240;

const Header = ({ DrawerHeader }) => {
  const { mode, setMode } = useColorScheme();
  const [open, setOpen] = useState(false);
  if (!mode) return null;
  const handleDrawerOpen = (isOpen) => {
    setOpen(isOpen);
  };

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));

  return (
    <div>
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            gap={1}
            display={"flex"}
            alignItems={"center"}
            justifyItems={"center"}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => handleDrawerOpen(true)}
              edge="start"
              sx={{
                ...(open && { display: "none" }),
                // display: { xs: "none", sm: "inline-flex" },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini Chat
            </Typography>
          </Stack>
          <Box
            gap={1}
            display={"flex"}
            alignItems={"center"}
            justifyItems={"center"}
          >
            <IconButton
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              sx={{
                width: 40,
                height: 40,
              }}
            >
              {mode === "dark" ? <SunnyIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerList
        DrawerHeader={DrawerHeader}
        open={open}
        handleDrawerOpen={handleDrawerOpen}
      />
    </div>
  );
};

export default Header;
