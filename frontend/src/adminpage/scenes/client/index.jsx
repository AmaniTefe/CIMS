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
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  // Add validation for other fields as needed
});

const Client = () => {
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

  // Define fetchData as an arrow function to access it in the component
  const fetchData = async () => {
    try {
      console.log("Fetching client data...");
      const response = await fetch(
        "http://localhost:8081/api/getJoinedClientData"
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching joined client data: ${response.statusText}`
        );
      }

      const result = await response.json();
      setData(result);
      console.log("Client data fetched successfully:", result);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching joined client data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  const [selectedClient, setSelectedClient] = useState({
    id: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    email: "",
    mobile_number: "",
    address: "",
    references: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar1, setOpenSnackbar1] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditClick = (params) => {
    setSelectedClient({
      id: params.id,
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      phone_number: params.phone_number,
      address: params.address,
      middle_name: params.middle_name,
      gender: params.gender,
      mobile_number: params.mobile_number,

      references: params.references,
    });
    setIsEditing(true);
    setAnchorEl(null);
  };

  const handleDeleteClick = (params) => {
    setSelectedClient(params);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log(
        "Sending DELETE request to http://localhost:8081/api/deleteClient"
      );
      console.log("Request Body:", JSON.stringify({ id: selectedClient.id }));

      const response = await fetch("http://localhost:8081/api/deleteClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedClient.id }),
      });

      if (response.ok) {
        console.log(
          `Client with ID ${selectedClient.id} deleted successfully!`
        );

        // Update the data state after successful deletion
        const updatedData = data.filter(
          (client) => client.id !== selectedClient.id
        );
        setData(updatedData);

        setOpenSnackbar(true);
      } else {
        console.error(`Error deleting client with ID ${selectedClient.id}`);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleEditFormChange = (e, fieldName, index) => {
    const { value } = e.target;

    let updatedValues = {};

    if (fieldName.startsWith("references")) {
      const referenceIndex = parseInt(fieldName.match(/\[(\d+)\]/)[1]);
      const referenceFieldName = fieldName.split(".")[1];

      // Update the form state for the nested field within the references array
      setValue(`references[${referenceIndex}].${referenceFieldName}`, value);

      updatedValues = {
        ...editedValues,
        references: editedValues.references ? [...editedValues.references] : [], // Create a shallow copy of references or initialize it as an empty array
      };

      // Update the specific reference if it exists, otherwise, initialize it
      if (updatedValues.references[referenceIndex]) {
        updatedValues.references[referenceIndex] = {
          ...updatedValues.references[referenceIndex],
          [referenceFieldName]: value,
        };
      } else {
        updatedValues.references[referenceIndex] = {
          [referenceFieldName]: value,
        };
      }
    } else {
      // Update the form state for non-nested fields
      setValue(fieldName, value);

      updatedValues = {
        ...editedValues,
        [fieldName]: value, // Update the latest edited value
      };
    }

    setEditedValues(updatedValues);
    console.log("Edited Values:", updatedValues);
  };

  const handleAddClientClick = () => {
    // Navigate to /addclient route
    navigate("/registrar/addclient");
    fetchData();
  };

  const handleEditFormSubmit = async () => {
    // Prepare the data to be sent to the backend
    const editedClientData = {
      id: selectedClient.id,
      first_name: editedValues.first_name,
      middle_name: editedValues.middle_name,
      last_name: editedValues.last_name,
      gender: editedValues.gender,
      email: editedValues.email,
      mobile_number: editedValues.mobile_number,
      address: editedValues.address,
      references: selectedClient.references.map((ref, index) => ({
        id: ref.id, // Include the reference ID
        reference_name: editedValues.references[index].reference_name, // Update reference_name
        reference_mobile: editedValues.references[index].reference_mobile, // Update reference_mobile
      })),
    };

    try {
      const token = localStorage.getItem("accessToken");
      const isEmailValid = await isEmailUnique(editedValues.email); // Use editedValues.email here

      if (!isEmailValid) {
        // Use errors object from react-hook-form to set errors
        // Assuming you're using 'errors' object from react-hook-form
        // Replace 'email' with the field name provided in your schema
        setError("email", {
          type: "manual",
          message: "This email is already in use. Please use a different one.",
        });
        return;
      }

      if (!token) {
        console.error("No token found");
        return;
      }

      console.log("Client data to be sent:", editedClientData);

      const response = await fetch("http://localhost:8081/api/editClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedClientData),
      });

      if (response.ok) {
        console.log("Client edited successfully!");
        fetchData();
        setOpenSnackbar1(true);
      } else {
        console.error("Error editing client:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing client:", error.message);
    } finally {
      setIsEditing(false);
      setEditedValues({
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "",
        email: "",
        mobile_number: "",
        address: "",
        references: [],
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedClient({
      id: null,
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      email: "",
      mobile_number: "",
      address: "",
      references: [],
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
      field: "references",
      headerName: "References",
      flex: 8,
      renderCell: (params) => {
        const references = params.row.references || [];
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {references.map((ref, index) => (
              <div key={index} style={{ marginRight: "16px" }}>
                <div style={{ fontWeight: "bold" }}>
                  {`Name: ${ref.reference_name}`}
                </div>
                <div>{`Mobile: ${ref.reference_mobile}`}</div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "  Actions",
      flex: 3,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
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
      <Header title="Client Management" subtitle="" />
      <Box
        display="flex"
        justifyContent="flex-end"
        marginBottom="20px"
        marginRight="20px"
      >
        <Button
          onClick={handleAddClientClick}
          variant="contained"
          color="secondary"
        >
          Add Client
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="115vh"
        paddingBottom="25vh"
        display="flex"
        flexDirection="column"
      >
        {isEditing && (
          <Dialog
            open={isEditing}
            onClose={handleCancelEdit}
            aria-labelledby="edit-client-dialog-title"
          >
            <DialogTitle id="edit-client-dialog-title">Edit Client</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(handleEditFormSubmit)}>
                <Box sx={{ gap: "20px", alignItems: "center" }}>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
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
                        onChange={(e) =>
                          handleEditFormChange(e, "mobile_number")
                        }
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
                <Box sx={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                  <Button type="submit" variant="outlined" color="success">
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </DialogContent>
          </Dialog>
        )}

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
            Client Deleted Successfuly
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
            Client Edited Successfuly
          </MuiAlert>
        </Snackbar>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="delete-client-dialog-title"
          aria-describedby="delete-client-dialog-description"
        >
          <DialogTitle id="delete-client-dialog-title">
            Delete Client
          </DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the client?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="success"
              onClick={() => setOpenDialog(false)}
              autoFocus
              variant="outlined"
            >
              Cancle
            </Button>
            <Button
              variant="outlined"
              onClick={handleConfirmDelete}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <DataGrid
          rows={data}
          columns={columns}
          pageSize={10}
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: () => (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Typography>No clients found</Typography>
              </Box>
            ),
            ErrorOverlay: () => (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Typography>An error occurred while fetching data</Typography>
              </Box>
            ),
          }}
          loading={loading}
          checkboxSelection={false}
          disableSelectionOnClick
          rowsPerPageOptions={[10]}
          sx={{
            flexGrow: 1,
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
      </Box>
    </Box>
  );
};

export default Client;
