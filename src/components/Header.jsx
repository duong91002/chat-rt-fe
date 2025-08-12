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
import { styled, useTheme } from "@mui/material/styles";
import { useColorScheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import DrawerList from "./DrawerList";
import MuiAppBar from "@mui/material/AppBar";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
const settings = ["Thông tin", "Đăng xuất"];
const drawerWidth = 240;
const Header = ({ DrawerHeader }) => {
  const { mode, setMode } = useColorScheme();
  const { logout } = useAuthStore();

  if (!mode) return null;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if (setting === "Đăng xuất") {
      logout();
      navigate("/login");
    }
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                ...(open && { display: "none" }),
                // display: { xs: "none", sm: "inline-flex" },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini chat
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
            {/* <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Tài khoản">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu(setting);
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box> */}
          </Box>
        </Toolbar>
      </AppBar>
      <DrawerList
        DrawerHeader={DrawerHeader}
        open={open}
        handleDrawerClose={handleDrawerClose}
      />
    </div>
  );
};

export default Header;
