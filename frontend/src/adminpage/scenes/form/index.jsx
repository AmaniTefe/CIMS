import { useState } from "react";
import { Box, Button, TextField, MenuItem, Snackbar } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiAlert from "@mui/material/Alert";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [emailExists, setEmailExists] = useState(false);
  const [roles, setRoles] = useState([
    "Admin",
    "Judge",
    "Registrar",
    "Proscuter",
    "Invoice_Clerk",
    "Court_Manager",
  ]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [judgeType, setJudgeType] = useState("");
  const [emailResponse, setEmailResponse] = useState(""); // State to hold email response
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
    confirm_password: "",
    role: "",
    judge_type: "",
  };
  const isEmailUnique = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/checkuseremail?email=${email}`
      );
      const data = await response.json();
      setEmailResponse(data.message); // Set email response message
      return data.isUnique;
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      return false;
    }
  };

  // Updated handleFormSubmit to send a POST request to the server
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Log form values
      console.log(values);
      // Check if the email is unique
      const isEmailValid = await isEmailUnique(values.email);

      if (!isEmailValid) {
        setEmailExists(true);
        return;
      }

      // Create an object based on the form data
      const userObject = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        address: values.address,
        password: values.password,
        confirm_password: values.confirm_password,
        role: values.role,
        judge_type: values.judge_type,
      };

      // Log the created object
      console.log(userObject);

      // Update roles state with the new role
      setRoles((prevRoles) => [...prevRoles, values.role]);

      // Sending a POST request to the server
      const response = await fetch("http://localhost:8081/api/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObject),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);

        // Show success notification
        setOpenSnackbar(true);

        // Reset the form after successful submission
        resetForm(initialValues);
      } else {
        // Handle errors
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="CREATE USER" subtitle="Create a New User Profile" />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gridRow="span 10"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name="first_name"
                error={!!touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                error={!!touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
                sx={{ gridColumn: "span 2" }}
              />
            <TextField
  fullWidth
  variant="filled"
  type="email"
  label="Email"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.email}
  name="email"
  error={
    !!touched.email && 
    (!!errors.email || emailExists) // Check if emailExists state is true
  }
  helperText={
    (touched.email && errors.email) ||
    (emailExists && "Email is already in use.") // Display error message
  }
  sx={{ gridColumn: "span 4" }}
/>


              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone_number}
                name="phone_number"
                error={!!touched.phone_number && !!errors.phone_number}
                helperText={touched.phone_number && errors.phone_number}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirm_password}
                name="confirm_password"
                error={!!touched.confirm_password && !!errors.confirm_password}
                helperText={touched.confirm_password && errors.confirm_password}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Role"
                select
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 4" }}
              >
                {roles.map((role, index) => (
                  <MenuItem key={index} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
              {values.role === "Judge" && ( // Only show if role is Judge
  <TextField
    fullWidth
    variant="filled"
    select
    label="Judge Type"
    onBlur={handleBlur}
    onChange={(e) => {
      handleChange(e);
      setJudgeType(e.target.value); // Update judge type state
    }}
    value={values.judge_type}
    name="judge_type"
    error={!!touched.judge_type && !!errors.judge_type}
    helperText={touched.judge_type && errors.judge_type}
    sx={{ gridColumn: "span 4" }}
  >
    <MenuItem value="Criminal">Criminal</MenuItem>
    <MenuItem value="Civil">Civil</MenuItem>
  </TextField>
)}
            </Box>
            <Box display="flex" justifyContent="space-between" mt="20px">
              <Button
                type="button"
                color="secondary"
                variant="contained"
                onClick={() => resetForm(initialValues)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ marginLeft: "10px" }}
              >
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          User created successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

const validationSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone Number is required"),
  address: yup.string().required("Address is required"),
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  role: yup.string().required("Role is required"),
});

export default Form;
