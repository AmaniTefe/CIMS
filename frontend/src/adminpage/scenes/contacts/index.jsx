import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Switch,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [editFormData, setEditFormData] = useState({
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    role: "Judge",
    judgeType: "",
  });

  const [userData, setUserData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [openSnackbar1, setOpenSnackbar1] = useState(false);
  const [showJudgeTypeDropdown, setShowJudgeTypeDropdown] = useState(false);

  const handleCloseSnackbar1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar1(false);
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getUsers");
      const data = await response.json();

      // Update the status property based on the backend data
      const updatedData = data.map((user) => ({
        ...user,
        status: user.status === "Activated",
      }));

      setUserData(updatedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Update the form data when editFormData changes
    setEditFormData((prevData) => ({
      ...prevData,
      id: editFormData.id,
      first_name: editFormData.first_name,
      last_name: editFormData.last_name,
      email: editFormData.email,
      phone_number: editFormData.phone_number,
      address: editFormData.address,
      role: editFormData.role,
      judgeType: editFormData.judgeType,
    }));
  }, [editFormData]);

  const handleEditClick = (params) => {
    console.log("Clicked Edit for ID:", params.id);
    setEditFormData({
      id: params.id,
      first_name: params.first_name,
      last_name: params.last_name,
      email: params.email,
      phone_number: params.phone_number,
      address: params.address,
      role: params.role,
      judgeType: params.judgeType || "",
    });
    setShowJudgeTypeDropdown(params.role === "Judge");
    setAnchorEl(null);
  };

  const handleDeleteClick = (params) => {
    setSelectedUserToDelete(params);
    setDeleteConfirmationOpen(true);
    setAnchorEl(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedUserToDelete.id }),
      });

      if (response.ok) {
        console.log(
          `User with ID ${selectedUserToDelete.id} deleted successfully!`
        );
        setOpenSnackbar(true);
        fetchUsers();
      } else {
        console.error(`Error deleting user with ID ${selectedUserToDelete.id}`);
      }
      setOpenSnackbar1(true);
    } catch (error) {
      console.error("Error deleting user:", error);
    }

    setDeleteConfirmationOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setEditFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleSwitchChange = async (userId, newStatus) => {
    try {
      const backendStatus = newStatus ? "Activated" : "Deactivated";

      const response = await fetch("http://localhost:8081/api/editUserStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, status: backendStatus }),
      });

      if (response.ok) {
        console.log(`User with ID ${userId} status updated successfully!`);

        // Immediately update the local state with the new status
        setUserData((prevData) =>
          prevData.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );

        setOpenSnackbar(true);
      } else {
        console.error(`Error updating user status with ID ${userId}`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        "http://localhost:8081/api/editUser",
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("User edited successfully!");
        setOpenSnackbar(true);
        fetchUsers();
      } else {
        console.error("Error editing user:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing user:", error.message);
    }

    setEditFormData({
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      role: "",
    });

    setAnchorEl(null);
  };

  const handleCancelEdit = () => {
    setEditFormData({
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      role: "",
    });

    setAnchorEl(null);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          color="secondary"
          name="status"
          inputProps={{ "aria-label": "controlled" }}
          onClick={() => handleSwitchChange(params.id, !params.value)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEditClick(params)}>
            <EditIcon style={{ color: "yellowgreen" }} />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteClick(params)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="115vh"
        paddingBottom="25vh"
        sx={{
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
      >
        <DataGrid
          rows={userData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
        />
      </Box>

      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: `${colors.blueAccent[900]}`, // Set your preferred background color
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this client?"}
        </DialogTitle>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancelDelete} color="error">
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleConfirmDelete}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        position="fixed"
        top="20%"
        left="20%"
        zIndex={1000}
        display={editFormData.id ? "block" : "none"}
        backgroundColor={`${colors.primary[500]}`}
        color={colors.grey[200]}
        padding="30px"
        borderRadius="20px"
        boxShadow={4}
        margin=" 0px 300px 300px 300px"
      >
        <form onSubmit={handleEditFormSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="first_name"
            value={editFormData.first_name}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="last_name"
            value={editFormData.last_name}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={editFormData.email}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            name="phone_number"
            value={editFormData.phone_number}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            margin="normal"
            name="address"
            value={editFormData.address}
            onChange={handleEditFormChange}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={editFormData.role || ""}
              onChange={handleEditFormChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Registrar">Registrar</MenuItem>
              <MenuItem value="Judge">Judge</MenuItem>
              <MenuItem value="Proscuter">Proscuter</MenuItem>
              <MenuItem value="Invoice_Clerk">Invoice_Clerk</MenuItem>
              <MenuItem value="Court_Manager">Court_Manager</MenuItem>
              {/* Add other roles as needed */}
            </Select>
          </FormControl>
          {editFormData.role === "Judge" && ( // Render judge type dropdown only if role is Judge
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="judge-type">Judge Type</InputLabel>
              <Select
                label="Judge Type"
                name="judgeType"
                value={editFormData.judgeType || ""}
                onChange={handleEditFormChange}
              >
                <MenuItem value="criminal">Criminal</MenuItem>
                <MenuItem value="civil">Civil</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: "10px", marginRight: "10px" }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancelEdit}
            sx={{ marginTop: "10px" }}
          >
            Cancel
          </Button>
        </form>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          elevation={6}
          severity="success"
          sx={{ width: "100%" }}
        >
          User edited successfully!
        </Alert>
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
          User Deleted Successfully
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Contacts;
