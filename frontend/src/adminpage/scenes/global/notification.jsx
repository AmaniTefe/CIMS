import React, { useContext, useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Badge,
  Box,
  useTheme,
} from "@mui/material";
import axios from "axios";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { ColorModeContext, tokens } from "../../../theme";

const Notifications = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:8081/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 2000); // Fetch every minute
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl1(null);
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8081/api/notifications/markallasread",
        {
          userId: notifications[0]?.user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      fetchNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <>
      <IconButton
        aria-controls="notification-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl1}
        keepMounted
        open={Boolean(anchorEl1)}
        onClose={handleClose}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification.id}>
              <Box display="flex" justifyContent="center">
                <div style={{ flex: 1, marginRight: 10 }}>
                  <Typography
                    style={{
                      overflowWrap: "break-word",
                      fontSize: "12px",
                      fontFamily: "Sora",
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    style={{
                      overflowWrap: "break-word",
                      fontSize: "10px",
                      fontFamily: "Sora",
                    }}
                  >
                    {new Date(notification.datetime).toLocaleString()}
                  </Typography>
                </div>
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box display="flex" justifyContent="center">
            <MenuItem>No notifications</MenuItem>
          </Box>
        )}

        {notifications.length > 0 && (
          <Box display="flex" justifyContent="center">
            <Button
              onClick={handleMarkAllAsRead}
              variant="contained"
              color="secondary"
            >
              Mark All as Read
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default Notifications;
