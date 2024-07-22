import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ProfilePage from ".";
const ViewProfilePages = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch user information from the database
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.userId;

        const response = await fetch("http://localhost:8081/api/getUserbyid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        });

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box backgroundColor={colors.blueAccent[900]}>
      <Header title="Profile" />
      <Box padding={2}>
        <Grid container spacing={2}>
          <Grid item>
            <img
              alt="profile-user"
              width="180px"
              height="180px"
              src={`http://localhost:8081/${user.image}`}
              style={{ borderRadius: "50%" }}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h4"
              margin={0.9}
              color={colors.grey[100]}
              style={{ fontWeight: "bold", fontSize: "1.1em" }}
            >
              First Name:{" "}
              <span
                style={{
                  color: colors.greenAccent[300],
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                {user.first_name}
              </span>
            </Typography>
            <Typography
              variant="h4"
              margin={0.9}
              color={colors.grey[100]}
              style={{ fontWeight: "bold", fontSize: "1.1em" }}
            >
              Last Name:{" "}
              <span
                style={{
                  color: colors.greenAccent[300],
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                {user.last_name}
              </span>
            </Typography>
            <Typography
              variant="h4"
              margin={0.9}
              color={colors.grey[100]}
              style={{ fontWeight: "bold", fontSize: "1.1em" }}
            >
              Email:{" "}
              <span
                style={{
                  color: colors.greenAccent[300],
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                {user.email}
              </span>
            </Typography>
            <Typography
              variant="h4"
              margin={0.9}
              color={colors.grey[100]}
              style={{ fontWeight: "bold", fontSize: "1.1em" }}
            >
              Phone:{" "}
              <span
                style={{
                  color: colors.greenAccent[300],
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                {user.phone_number}
              </span>
            </Typography>
            <Typography
              variant="h4"
              margin={0.9}
              color={colors.grey[100]}
              style={{ fontWeight: "bold", fontSize: "1.1em" }}
            >
              Address:{" "}
              <span
                style={{
                  color: colors.greenAccent[300],
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                {user.address}
              </span>
            </Typography>
            <Typography
              variant="h4"
              margin={0.9}
              color={colors.grey[100]}
              style={{ fontWeight: "bold", fontSize: "1.1em" }}
            >
              Role:{" "}
              <span
                style={{
                  color: colors.greenAccent[300],
                  fontWeight: "bold",
                  fontSize: "1.1em",
                }}
              >
                {user.role}
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent style={{ backgroundColor: colors.blueAccent[900] }}>
          {/* Your profile editing form component */}
          <ProfilePage />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              color="error"
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

export default ViewProfilePages;
