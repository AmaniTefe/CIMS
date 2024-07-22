import React, { useContext } from "react";
import { Link } from "react-router-dom";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Lottie from "react-lottie"; // Import Lottie library
import "./navbar.css";
import {
  AppBar,
  Toolbar,
  useTheme,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

// Import your Lottie animation file
import animationData from "../logo.json";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const colorMode = useContext(ColorModeContext);

  const buttonStyle = {
    textTransform: "none",
    marginLeft: "5px",
    color: colors.blueAccent && colors.grey[100] ? colors.grey[100] : "#fff",
    "&:hover": {
      color:
        colors.secondary && colors.secondary[300]
          ? colors.secondary[300]
          : colors.primary[100],
    },
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: colors.primary[700],
        height: "75px",
        paddingBottom: "5px",
        paddingTop: "10px",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side */}
        <Box display="flex" alignItems="center">
          {/* Replace the logo with Lottie animation */}
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: animationData,
            }}
            height={85} // Set the height as needed
            width={85}  // Set the width as needed
          />
          <Typography
          className="courtm"
            variant="h6"
            component="div"
            sx={{
              color: colors.primary && colors.grey[100],
              fontSize: "1.8rem",
              fontFamily: '"Trirong", serif',
              fontWeight: 700,
              ml: "10px",

              
            }}
          >
            Court Information System
          </Typography>
        </Box>

        {/* Right side */}
        <Box display="flex" alignItems="center">
          {/* Other buttons */}
          <Button
            onClick={colorMode.toggleColorMode}
            sx={{ ...buttonStyle, marginRight: "10px" }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
