import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  FormControl,
  FormLabel,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import * as yup from "yup";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().required("Middle Name is required"),
  lastName: yup.string().required("Last Name is required"),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: yup.string().required("Mobile Number is required"),
  alternateNumber: yup.string(),
  address: yup.string().required("Address is required"),
});

const isEmailUnique = async (email) => {
  try {
    const response = await fetch(
      `http://localhost:8081/api/checkemail?email=${email}`
    );
    const data = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error("Error checking email uniqueness:", error);
    return false;
  }
};
const createUserObject = (values) => {
  return {
    first_name: values.firstName,
    middle_name: values.middleName,
    last_name: values.lastName,
    gender: values.gender,
    email: values.email,
    mobile_number: values.mobileNumber,
    alternate_number: values.alternateNumber,
    address: values.address,
  };
};

const AddAdvocator = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "male",
      email: "",
      mobileNumber: "",
      alternateNumber: "",
      address: "",
    },
    onSubmit: (values) => handleSubmit(values, formik),
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleSubmit = async (values, formik) => {
    try {
      // Check if the email is unique
      const isEmailValid = await isEmailUnique(values.email);

      if (!isEmailValid) {
        formik.setErrors({
          email: "This email is already in use. Please use a different one.",
        });
        return;
      }

      // Continue with the rest of your form submission logic
      console.log("Form submitted");
      console.log("Formik Values:", values);

      const advocatorObject = createUserObject(values);

      console.log("Advocator Object:", advocatorObject);

      try {
        JSON.parse(JSON.stringify(advocatorObject));
        console.log("Advocator Object is a valid JSON");
      } catch (error) {
        console.error("Advocator Object is not a valid JSON:", error);
        return;
      }

      console.log(
        "Sending request to:",
        "http://localhost:8081/api/addadvocator"
      );

      let response;

      try {
        response = await fetch("http://localhost:8081/api/addadvocator", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(advocatorObject),
        });

        console.log("Response Status:", response.status);
        console.log("Response OK:", response.ok);
      } catch (error) {
        console.error("Error during fetch:", error);
        return;
      }

      if (response.ok) {
        const responseData = await response.json();
        console.log("API Response:", responseData);
        formik.resetForm();
      } else {
        console.error("Failed to submit form data");
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  useEffect(() => {
    console.log("Initial Formik Values:", formik.values);
  }, [formik.values]);

  const handleCancel = () => {
    formik.resetForm();
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Advocator Management" subtitle="Add Advocator" />
      <form onSubmit={formik.handleSubmit}>
        <Box
          padding="20px"
          backgroundColor={colors.blueAccent[900]}
          sx={{ mb: "150px" }}
        >
          <Box
            sx={{
              backgroundColor: `${colors.primary[400]}75`,
            }}
            padding="30px"
            borderRadius="10px"
            margin="5px"
          >
            <Box sx={{ display: "flex", gap: "20px" }}>
              <TextField
                name="firstName"
                label="First Name"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={formik.touched.firstName && !!formik.errors.firstName}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                name="middleName"
                label="Middle Name"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.middleName}
                error={formik.touched.middleName && !!formik.errors.middleName}
                helperText={
                  formik.touched.middleName && formik.errors.middleName
                }
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={formik.touched.lastName && !!formik.errors.lastName}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Box>
            <Box sx={{ display: "flex", mt: "20px", gap: "20px" }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  name="gender"
                  value={formik.values.gender || "male"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  row
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio color="default" />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio color="default" />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                name="mobileNumber"
                label="Mobile Number (+2519XXXXXXXX)"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.mobileNumber}
                error={
                  formik.touched.mobileNumber && !!formik.errors.mobileNumber
                }
                helperText={
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                }
              />
            </Box>
            <Box sx={{ display: "flex", mt: "20px", gap: "20px" }}>
              <TextField
                name="alternateNumber"
                label="Alternate Number"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.alternateNumber}
              />
              <TextField
                name="address"
                label="Address"
                variant="outlined"
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.address}
                error={formik.touched.address && !!formik.errors.address}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: "20px",
            }}
          >
            <Button
              type="button"
              color="secondary"
              variant="contained"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              sx={{ marginLeft: "10px" }}
            >
              Add Advocator
            </Button>
          </Box>
        </Box>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Advocate Added Successfully
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddAdvocator;
