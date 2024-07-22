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
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().required("Middle Name is required"),
  lastName: yup.string().required("Last Name is required"),
  gender: yup.string().required("Gender is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: yup.string().required("Mobile Number is required"),
  alternateNumber: yup.string(),
  address: yup.string().required("Address is required"),
  references: yup.array().of(
    yup.object().shape({
      referenceName: yup.string(),
      referenceMobile: yup.string(),
    })
  ),
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
    references: values.references.map((reference) => ({
      reference_name: reference.referenceName,
      reference_mobile: reference.referenceMobile,
    })),
  };
};

const AddClient = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

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
      references: [{ referenceName: "", referenceMobile: "" }],
    },
    onSubmit: (values) => handleSubmit(values, formik),
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleAddReference = () => {
    formik.setFieldValue("references", [
      ...formik.values.references,
      { referenceName: "", referenceMobile: "" },
    ]);
  };

  const handleRemoveReference = (index) => {
    const updatedReferences = [...formik.values.references];
    updatedReferences.splice(index, 1);
    formik.setFieldValue("references", updatedReferences);
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

      const userObject = createUserObject(values);

      console.log("User Object:", userObject);

      try {
        JSON.parse(JSON.stringify(userObject));
        console.log("User Object is a valid JSON");
      } catch (error) {
        console.error("User Object is not a valid JSON:", error);
        return;
      }

      console.log("Sending request to:", "http://localhost:8081/api/addclient");

      let response;

      try {
        response = await fetch("http://localhost:8081/api/addclient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObject),
        });

        console.log("Response Status:", response.status);
        console.log("Response OK:", response.ok);
        setOpenSnackbar(true);
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
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  useEffect(() => {
    console.log("Initial Formik Values:", formik.values);
  }, [formik.values]);

  const handleCancel = () => {
    formik.resetForm();
    navigate("/registrar/viewclient");
  };

  return (
    <Box padding="30px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Client Management" subtitle="Add Client" />
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
                label="Alternate Number (+2519XXXXXXXX)"
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
            <Box sx={{ mt: "20px" }}>
              <FormLabel component="legend">References</FormLabel>
              {formik.values.references.map((reference, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <TextField
                    name={`references[${index}].referenceName`}
                    label="Reference Name"
                    variant="outlined"
                    fullWidth
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={reference.referenceName}
                  />
                  <TextField
                    name={`references[${index}].referenceMobile`}
                    label="Reference Mobile"
                    variant="outlined"
                    fullWidth
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={reference.referenceMobile}
                  />
                  <Button
                    type="button"
                    color="secondary"
                    variant="contained"
                    onClick={() => handleRemoveReference(index)}
                    startIcon={<DeleteOutlineIcon />}
                    sx={{
                      ml: "10px",
                      width: "150px",
                      height: "40px",
                      backgroundColor: "gainsboro",
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                type="button"
                color="secondary"
                variant="contained"
                onClick={handleAddReference}
                sx={{ mt: "10px" }}
              >
                Add Reference
              </Button>
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
              Add Client
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
          Client Added Successfully
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddClient;
