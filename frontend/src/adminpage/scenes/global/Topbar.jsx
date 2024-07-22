import {
  Box,
  IconButton,
  useTheme,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import ViewProfilePages from "../profile/profile";
import Notifications from "./notification";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleclickprofilebutton = () => {
    setOpenDialog(true);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings-popover" : undefined;

  return (
    <Box
      display="flex"
      justifyContent="end"
      p={2}
      backgroundColor={colors.blueAccent[900]}
    >
      {" "}
      <div id="google_translate_element"></div>
      {/* SEARCH BAR */}
      <Box display="flex" alignItems={"flex-start"} borderRadius="3px">
        {/* Search bar content */}
      </Box>
      {/* ICONS */}
      <Box display="flex">
        {/* Dark/Light mode toggle */}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <Notifications />
        <IconButton onClick={handleSettingsClick}>
          <PersonOutlinedIcon />
        </IconButton>
        {/* User profile menu */}
        <Menu
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              borderRadius: "10px", // Rounded corners
            },
          }}
        >
          {/* Menu items */}
          <Box p={1}>
            <MenuItem onClick={handleclickprofilebutton} variant="outlines">
              <ListItemIcon>
                <PersonOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
          </Box>
          <Box p={1}>
            <MenuItem variant="outlines" onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Box>
        </Menu>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent style={{ backgroundColor: colors.blueAccent[900] }}>
          {/* Your profile editing form component */}
          <ViewProfilePages />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              color="error"
              variant="outlined"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Topbar;
