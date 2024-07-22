import React, { useEffect } from "react";
import Header from "../../components/Header";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";

const Casetype = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [casesubtype, setCasesubtype] = useState("");
  const [CaseTypes, setCaseTypes] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbar1, setOpenSnackbar1] = useState(false);

  const [caseSubTypeToDelete, setCaseSubTypeToDelete] = useState(null);
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [opencasesubtype, setOpencasesubtype] = useState(false); // Define opencasesubtype state variable
  const [casesubtypeerror, setCasesubtypeerror] = useState(false);

  const handleaddcasesubtypebuttonClick = () => {
    console.log("Adding case subtype button clicked");
    setOpencasesubtype(true);
  };

  const handleclosecasesubtype = () => {
    console.log("Closing case subtype modal");
    // Reset the state variables related to case subtype modal
    setCasesubtype("");
    setCasesubtypeerror(false);
    setSelectedCaseType("");
    setOpencasesubtype(false);
  };
  const subtypeValidationSchema = Yup.object().shape({
    casesubtype: Yup.string().required("Case subtype Name is required"),
  });

  const handSubTypeSave = () => {
    console.log("Saving case subtype");
    // Validate form fields
    subtypeValidationSchema
      .validate({ casesubtype }, { abortEarly: false })
      .then(() => {
        // If validation succeeds, proceed with saving
        console.log("Validation successful. Sending request...");
        axios
          .post("http://localhost:8081/api/addcasesubtype", {
            case_type: selectedCaseType,
            sub_type_name: casesubtype,
          })

          .then((response) => {
            console.log("Case subtype saved successfully");
            handleclosecasesubtype();
            fetchCaseTypes();
            setOpenSnackbar1(true);
          })
          .catch((error) => {
            console.error("Error saving case subtype:", error);
          });
      })

      .catch((error) => {
        // If validation fails, set error states for invalid fields
        console.log("Validation failed:", error);
        const validationErrors = {};
        error.inner.forEach((fieldError) => {
          validationErrors[fieldError.path] = fieldError.message;
        });
        setCasesubtypeerror(validationErrors.casesubtype || false);
      });
  };

  const fetchCaseTypes = () => {
    axios
      .get("http://localhost:8081/api/getCaseTypeGrid")
      .then((response) => {
        console.log("Case types fetched successfully:", response.data);
        setCaseTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching case types:", error);
      });
  };

  useEffect(() => {
    // Call the fetchCaseTypes function
    fetchCaseTypes();
  }, []);

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
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
    setOpenSnackbar(false);
  };

  const handleDeleteClick = (id) => {
    setCaseSubTypeToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      if (!caseSubTypeToDelete) {
        console.error("Invoice ID is missing.");
        return;
      }

      const response = await fetch(
        "http://localhost:8081/api/deletecasesubtype",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: caseSubTypeToDelete }),
        }
      );

      if (response.ok) {
        setDeleteConfirmationOpen(false);
      } else {
        console.error("Failed to delete invoice:", response.statusText);
      }
      setOpenSnackbar(true);
      fetchCaseTypes();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const columns = [
    // Define columns for DataGrid
    { field: "id", headerName: "Number", flex: 0.5 },
    { field: "caseSubType", headerName: "Case Sub Types", flex: 2 },
    { field: "caseType", headerName: "Case Type", flex: 2.3 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton aria-label="delete">
            <DeleteIcon
              onClick={() => handleDeleteClick(params.row.id)}
              style={{ color: "#FD4653" }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Case Type" subtitle="" />
      <Box gap={2} display="flex" justifyContent="flex-end" mt="20px">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleaddcasesubtypebuttonClick}
          startIcon={<AddIcon fontSize="small" />}
        >
          Add Case Sub type
        </Button>
        <Modal
          open={opencasesubtype}
          onClose={handleclosecasesubtype}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Add Case Sub Type
            </Typography>
            <Box mt="10px">
              <FormControl fullWidth>
                <InputLabel>Select Case Type</InputLabel>
                <Select
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="civil">Civil</MenuItem>
                  <MenuItem value="criminal">Criminal</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box mt="10px">
              <TextField
                value={casesubtype}
                required
                label="Enter Case Sub Type"
                onChange={(e) => {
                  setCasesubtype(e.target.value);
                  setCasesubtypeerror(false);
                }}
                error={casesubtypeerror}
                helperText={casesubtypeerror ? "Case Type is required" : ""}
                fullWidth
              />
            </Box>
            <Box gap="5px" display="flex" justifyContent="end" mt="20px">
              <Button
                color="error"
                variant="outlined"
                onClick={handleclosecasesubtype}
                startIcon={<ClearIcon />}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handSubTypeSave}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
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
        <DialogTitle id="alert-dialog-title" color="secondary">
          {"Are you sure you want to delete this Case Sub Type?"}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteConfirmation}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
          Case Sub Type Deleted Successfully
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
          Case Sub Type Added Successfully
        </MuiAlert>
      </Snackbar>
      <Box mt="10px" padding="5px" backgroundColor={colors.blueAccent[900]}>
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
            rows={CaseTypes}
            columns={columns}
            getRowId={(row) => row.id}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Casetype;
