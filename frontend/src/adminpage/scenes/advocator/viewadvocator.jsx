import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid, GridCloseIcon, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { tokens } from "../../../theme";

// Define validation schema for form fields
const validationSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  middle_name: yup.string(),
  last_name: yup.string().required("Last Name is required"),
  gender: yup.string(),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile_number: yup.string(),
  address: yup.string(),
});

const Advocator = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const navigate = useNavigate();

  // Function to fetch advocator data
  const fetchAdvocatorData = async () => {
    try {
      console.log("Fetching advocator data...");
      const response = await fetch(
        "http://localhost:8081/api/getAdvocatorData"
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching advocator data: ${response.statusText}`
        );
      }

      const result = await response.json();

      // Map the fetched data and rename 'advocator_id' to 'id'
      const formattedData = result.map((advocator) => ({
        id: advocator.advocator_id,
        first_name: advocator.first_name,
        middle_name: advocator.middle_name,
        last_name: advocator.last_name,
        gender: advocator.gender,
        email: advocator.email,
        mobile_number: advocator.mobile_number,
        address: advocator.address,
      }));

      setData(formattedData);
      console.log("Advocator data fetched successfully:", formattedData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching advocator data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocatorData(); // Call fetchAdvocatorData when the component mounts
  }, []);

  const [selectedAdvocator, setSelectedAdvocator] = useState({
    id: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    email: "",
    mobile_number: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar1, setOpenSnackbar1] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  const handleEditClick = (params) => {
    setSelectedAdvocator(params);
    setIsEditing(true);
  };

  const handleDeleteClick = (params) => {
    setSelectedAdvocator(params);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log(
        "Sending DELETE request to http://localhost:8081/api/deleteAdvocator"
      );
      console.log(
        "Request Body:",
        JSON.stringify({ id: selectedAdvocator.id })
      );

      const response = await fetch(
        "http://localhost:8081/api/deleteAdvocator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: selectedAdvocator.id }),
        }
      );

      if (response.ok) {
        console.log(
          `Advocator with ID ${selectedAdvocator.id} deleted successfully!`
        );

        // Update the data state after successful deletion
        const updatedData = data.filter(
          (advocator) => advocator.id !== selectedAdvocator.id
        );
        setData(updatedData);

        setOpenSnackbar(true);
      } else {
        console.error(
          `Error deleting advocator with ID ${selectedAdvocator.id}`
        );
      }
    } catch (error) {
      console.error("Error deleting advocator:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleEditFormChange = (e, fieldName) => {
    const { value } = e.target;

    // Update the form state for the edited field
    setValue(fieldName, value);

    // Update the editedValues object
    setEditedValues({
      ...editedValues,
      [fieldName]: value,
    });
  };

  const handleEditFormSubmit = async () => {
    // Prepare the data to be sent to the backend
    const editedAdvocatorData = {
      id: selectedAdvocator.id,
      first_name: editedValues.first_name,
      middle_name: editedValues.middle_name,
      last_name: editedValues.last_name,
      gender: editedValues.gender,
      email: editedValues.email,
      mobile_number: editedValues.mobile_number,
      address: editedValues.address,
    };

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      console.log("Advocator data to be sent:", editedAdvocatorData);

      const response = await fetch("http://localhost:8081/api/editAdvocator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedAdvocatorData),
      });

      if (response.ok) {
        console.log("Advocator edited successfully!");
        fetchAdvocatorData();
        setOpenSnackbar1(true);

        // Reset form values and state
        setIsEditing(false);
        setEditedValues({}); // Clear editedValues
        // Reset form values using setValue
        setValue("first_name", "");
        setValue("middle_name", "");
        setValue("last_name", "");
        setValue("gender", "");
        setValue("email", "");
        setValue("mobile_number", "");
        setValue("address", "");
      } else {
        console.error("Error editing advocator:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing advocator:", error.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedAdvocator({
      id: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      email: "",
      mobile_number: "",
      address: "",
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSnackbar1 = () => {
    setOpenSnackbar1(false);
  };

  const columns = [
    { field: "first_name", headerName: "First Name", flex: 2.5 },
    { field: "middle_name", headerName: "Middle Name", flex: 2.5 },
    { field: "last_name", headerName: "Last Name", flex: 2.5 },
    { field: "gender", headerName: "Gender", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "mobile_number", headerName: "Mobile Number", flex: 2.5 },
    { field: "address", headerName: "Address", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            onClick={() => handleEditClick(params.row)}
            style={{ color: "yellowgreen" }}
          >
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDeleteClick(params.row)}
            style={{ color: "rgba(255, 0, 0, 0.9)" }}
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      {/* Header Component */}
      <Header title="Advocator Management" subtitle="" />

      {/* Edit Form Modal */}
      <Dialog
        open={isEditing}
        onClose={handleCancelEdit}
        aria-labelledby="edit-advocator-dialog-title"
        aria-describedby="edit-advocator-dialog-description"
      >
        <DialogTitle id="edit-advocator-dialog-title">
          Edit Advocator
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(handleEditFormSubmit)}
            id="edit-advocator-form"
          >
            <Box sx={{ gap: "20px", alignItems: "center" }}>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    onChange={(e) => handleEditFormChange(e, "first_name")}
                  />
                )}
              />
              <Controller
                name="middle_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Middle Name"
                    fullWidth
                    required
                    margin="normal"
                    onChange={(e) => handleEditFormChange(e, "middle_name")}
                  />
                )}
              />
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    onChange={(e) => handleEditFormChange(e, "last_name")}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gender"
                    fullWidth
                    required
                    margin="normal"
                    onChange={(e) => handleEditFormChange(e, "gender")}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    required
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    onChange={(e) => handleEditFormChange(e, "email")}
                  />
                )}
              />
              <Controller
                name="mobile_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile Number (+2519XXXXXXXX)"
                    fullWidth
                    required
                    margin="normal"
                    onChange={(e) => handleEditFormChange(e, "mobile_number")}
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    required
                    margin="normal"
                    onChange={(e) => handleEditFormChange(e, "address")}
                  />
                )}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancelEdit} color="error">
            Cancel
          </Button>
          <Button
            variant="outlined"
            type="submit"
            form="edit-advocator-form"
            color="success"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Grid Component */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
        disableSelectionOnClick
        components={{
          Toolbar: GridToolbar,
        }}
        sx={{
          width: "100%",
          height: "600px",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      />

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
          Advocate Deleted Successfuly
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={openSnackbar1}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar1}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar1}
          severity="success"
          sx={{ width: "100%" }}
        >
          Advocate Edited Successfuly
        </MuiAlert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this advocator?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setOpenDialog(false)}
            color="success"
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Advocator;
