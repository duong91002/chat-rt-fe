import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { getNavigateConfig } from "../configs/navigateConfig";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Tooltip } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useAuthStore from "../store/authStore";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerList = ({ open, handleDrawerClose, DrawerHeader }) => {
  const theme = useTheme();
  const navigateConfig = getNavigateConfig();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <StyledDrawer
      variant={"permanent"}
      open={open}
      onClose={handleDrawerClose}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {navigateConfig.map((group) => (
          <React.Fragment key={group.segment}>
            {open && (
              <ListItem sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {group.title}
                </Typography>
              </ListItem>
            )}

            {group.children.map((child) => (
              <ListItem
                key={child.segment}
                disablePadding
                sx={{ display: "block" }}
                onClick={() => navigate(child.path)}
              >
                <Tooltip title={!open ? child.title : ""} placement="right">
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={child.title}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}

            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
      </List>

      <List>
        <Divider sx={{ my: 1 }} />
        <ListItem
          disablePadding
          sx={{ display: "block" }}
          onClick={handleLogout}
        >
          <Tooltip title={!open ? "Đăng xuất" : ""} placement="right">
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemText
                primary={
                  open ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={user?.avatar} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{user?.name}</span>
                      </div>
                    </Box>
                  ) : (
                    ""
                  )
                }
                sx={{ opacity: open ? 1 : 0 }}
              />
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  ml: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <ExitToAppIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default DrawerList;
