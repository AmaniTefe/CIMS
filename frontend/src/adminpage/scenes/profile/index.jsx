import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as yup from "yup";
import { Save } from "@mui/icons-material";

const ProfilePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [imagePath, setImagePath] = useState("");
  const fileInputRef = useRef(null);
  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // State to hold user data
  const [user, setUser] = useState(null);

  // Fetch user information from the database
  useEffect(() => {
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

  const handleSubmit = async (values) => {
    try {
      // Log the form values before sending them to the backend
      console.log("Form values:", values);

      // Make a POST request to update user information
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      const response = await fetch(
        `http://localhost:8081/api/updateUser/${userId}`,
        {
          method: "POST",
          body: JSON.stringify(values), // Send form values as JSON data
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
        }
      );
      const data = await response.json();
      console.log("User information updated:", data);

      // Optionally, you can reset the form fields here
      formik.resetForm();

      // Fetch user image after updating the information
      fetchUserImage();

      // Check if the form is valid and the submission is successful
      if (response.ok) {
        // Refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const fetchUserImage = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      const response = await fetch(
        `http://localhost:8081/api/getUserImage/${userId}`
      );
      const data = await response.json();
      const { imagePath } = data;

      setImagePath(imagePath);
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };
  useEffect(() => {
    fetchUserImage();
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: user && user.first_name,
      lastName: user ? user.lastame : "",
      email: user ? user.email : "",
      phone: user ? user.phone : "",
      address: user ? user.address : "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        // Retrieve the user ID from the decoded token
        const accessToken = localStorage.getItem("accessToken");
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.userId;
        // Append the user ID to the FormData object
        formData.append("userId", userId);
        // Make a POST request to upload the file to the server
        const response = await fetch("http://localhost:8081/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        // Update the imagePath state variable synchronously
        setImagePath(data.filePath);
        // Fetch user image automatically after selecting a new image
        fetchUserImage(); // Call fetchUserImage function here
        // Display the selected image automatically
        const reader = new FileReader();
        reader.onload = () => {
          setImagePath(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <Box padding="10px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Edit Profile" />
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Box paddingLeft={22}>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <label htmlFor="fileInput">
                <img
                  alt="profile-user"
                  width="180px"
                  height="180px"
                  src={`http://localhost:8081/${imagePath}`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  onClick={handleImageClick}
                />
              </label>
            </Box>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Box>
              <Box display="flex" gap={2} mt={2}>
                <TextField
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Box>
              <Box display="flex" gap={3} mt={3}>
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Box>
              <Box display="flex" gap={2} mt={2}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </Box>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              startIcon={<Save fontSize="small" />}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ProfilePage;
