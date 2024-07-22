import React from "react";
import Header from "../../components/Header";
import { Box, Button, TextField, Typography, Snackbar } from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import * as Yup from "yup";
import { useEffect } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";

const Casetype = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [opencasesubtype, setOpencasesubtype] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar1, setOpenSnackbar1] = useState(false);
  const [openSnackbar2, setOpenSnackbar2] = useState(false);

  const [serviceNameError, setServiceNameError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [services, setServices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedserviceToDelete, setSelectedserviceToDelete] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: "",
    amount: "",
  });

  useEffect(() => {
    // Update the form data when editFormData changes
    setEditFormData((prevData) => ({
      ...prevData,
      id: editFormData.id,
      name: editFormData.name,
      amount: editFormData.amount,
    }));
  }, [editFormData]);

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleEditClick = (params) => {
    console.log("Clicked Edit for ID:", params.id);
    setEditFormData({
      id: params.id,
      name: params.name,
      amount: params.amount,
    });

    setAnchorEl(null);
  };

  const handleCancelEdit = () => {
    setEditFormData({
      id: null,
      name: "",
      amount: "",
    });

    setAnchorEl(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const columns = [
    { field: "Number", headerName: "Number", flex: 0.5 },
    {
      field: "Service Name",
      headerName: "Service Name",
      flex: 2.3,
    },
    {
      field: "Service Price",
      headerName: "Service Price",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEditClick(params)}>
            <EditIcon style={{ color: "#2CF954" }} />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDeleteClick(params)}
          >
            <DeleteIcon style={{ color: "#FD4653" }} />
          </IconButton>
        </>
      ),
    },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const validationSchema = Yup.object().shape({
    serviceName: Yup.string().required("Service Name is required"),
    amount: Yup.number().required("Amount is required"),
  });

  const handleaddServicebuttonClick = () => {
    setOpencasesubtype(true);
  };

  const handlecloseaddservice = () => {
    setOpencasesubtype(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  const handleCloseSnackbar1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar1(false);
  };
  const handleCloseSnackbar2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar2(false);
  };

  const handleSave = () => {
    // Validate form fields
    validationSchema
      .validate({ serviceName, amount }, { abortEarly: false })
      .then(() => {
        // If validation succeeds, proceed with saving
        axios
          .post("http://localhost:8081/api/addservice", {
            name: serviceName,
            amount: amount,
          })
          .then((response) => {
            console.log("Service saved successfully");
            handlecloseaddservice();
            setOpenSnackbar2(true);
            fetchServices();
          })
          .catch((error) => {
            console.error("Error saving service:", error);
          });
      })
      .catch((error) => {
        // If validation fails, set error states for invalid fields
        const validationErrors = {};
        error.inner.forEach((fieldError) => {
          validationErrors[fieldError.path] = fieldError.message;
        });
        setServiceNameError(validationErrors.serviceName || false);
        setAmountError(validationErrors.amount || false);
      });
  };

  useEffect(() => {
    // Fetch services when the component mounts
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/getServices");
      const formattedData = response.data.map((service, index) => ({
        id: service.id,
        Number: index + 1, // Assuming Number is a sequential identifier
        "Service Name": service.name,
        "Service Price": service.amount,
      }));
      setServices(formattedData);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  const handleDeleteClick = (params) => {
    setSelectedserviceToDelete(params);
    setDeleteConfirmationOpen(true);
    setAnchorEl(null);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        "http://localhost:8081/api/editservice",
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Service edited successfully!");
        setOpenSnackbar(true);
        fetchServices();
      } else {
        console.error("Error editing Service:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing Service:", error.message);
    }

    setEditFormData({
      id: null,
      name: "",
      amount: "",
    });

    setAnchorEl(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/deleteService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedserviceToDelete.id }),
      });

      if (response.ok) {
        console.log(
          `service with ID ${selectedserviceToDelete.id} deleted successfully!`
        );
        setOpenSnackbar1(true);
        fetchServices();
      } else {
        console.error(
          `Error deleting service with ID ${selectedserviceToDelete.id}`
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }

    setDeleteConfirmationOpen(false);
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Services" subtitle="" />
      <Box gap={2} display="flex" justifyContent="flex-end" mt="20px">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleaddServicebuttonClick}
          startIcon={<AddIcon fontSize="small" />}
        >
          Add Service
        </Button>
        <Modal
          open={opencasesubtype}
          onClose={handlecloseaddservice}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          validationSchema={validationSchema}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Service
            </Typography>
            <Box mt="10px">
              <TextField
                required
                label="Enter Service Name"
                value={serviceName}
                onChange={(e) => {
                  setServiceName(e.target.value);
                  // Reset error state when user starts typing
                  setServiceNameError(false);
                }}
                error={serviceNameError} // Apply error style if error is true
                helperText={serviceNameError ? "Service Name is required" : ""}
                fullWidth
              />
            </Box>
            <Box mt="10px">
              <TextField
                required
                label="Enter Amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError(false);
                }}
                error={amountError}
                helperText={amountError ? "Amount is required" : ""}
                fullWidth
              />
            </Box>
            <Box gap="5px" display="flex" justifyContent="end" mt="20px">
              <Button
                color="error"
                variant="outlined"
                onClick={handlecloseaddservice}
                startIcon={<ClearIcon />}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="outlined"
                onClick={handleSave}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
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
            Service Added Successfully
          </MuiAlert>
        </Snackbar>
      </Box>
      <Box
        sx={{ mt: "10px" }}
        padding="5px"
        backgroundColor={colors.blueAccent[900]}
      >
        <Box
          m="40px 0 0 0"
          height="115vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
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
            rows={services} // You need to provide rows data here
            columns={columns}
            components={{ Toolbar: GridToolbar }}
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
            {"Are you sure you want to delete this Service?"}
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={handleCancelDelete}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              onClick={handleConfirmDelete}
              color="success"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
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
            label="Service Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={editFormData.name}
            onChange={handleEditFormChange}
          />
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            margin="normal"
            name="amount"
            value={editFormData.amount}
            onChange={handleEditFormChange}
          />
          <Button
            type="submit"
            variant="outlined"
            color="success"
            sx={{ marginTop: "10px", marginRight: "10px" }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="error"
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
          severity="success"
          sx={{ width: "100%" }}
        >
          Service edited successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackbar1}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar1}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar1}
          severity="success"
          sx={{ width: "100%" }}
        >
          Service Deleted successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackbar2}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar2}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar2}
          severity="success"
          sx={{ width: "100%" }}
        >
          Service Saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default Casetype;
