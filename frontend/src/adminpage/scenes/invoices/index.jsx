import {
  Box,
  useTheme,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as needed
  };

  const columns = [
    { field: "invoice_id", headerName: "Invoice ID", flex: 0.5 },
    {
      field: "invoice_number",
      headerName: "Invoice No",
      flex: 0.5,
    },
    {
      field: "case_id",
      headerName: "Case ID",
      flex: 0.3,
    },
    {
      field: "Services",
      headerName: "Services",
      flex: 1.2,
      renderCell: (params) => (
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <ul style={{ margin: 0, padding: 0 }}>
            {params.row.items &&
              params.row.items.map((item, index) => (
                <li key={index}>
                  {item.service}: {item.amount}
                </li>
              ))}
          </ul>
        </div>
      ),
    },

    {
      field: "total_amount",
      headerName: "Total Amount",
      flex: 0.7,
    },
    {
      field: "Due",
      headerName: "Due Date",
      flex: 0.8,
      valueGetter: (params) => formatDate(params.row.due_date),
    },
    {
      field: "paid_status",
      headerName: "Payment Status",
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDetailButtonClick(params.row.invoice_id)} // Pass invoice_id
          >
            Details
          </Button>
          <IconButton aria-label="delete">
            <DeleteIcon
              onClick={() => handleDeleteClick(params.row.invoice_id)}
              style={{ color: "#FD4653" }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleDeleteClick = (invoiceId) => {
    setInvoiceToDelete(invoiceId); // Set selected invoice ID
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      if (!invoiceToDelete) {
        console.error("Invoice ID is missing.");
        return;
      }

      const response = await fetch("http://localhost:8081/api/deleteinvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoiceId: invoiceToDelete }),
      });

      if (response.ok) {
        fetchInvoices();
        setDeleteConfirmationOpen(false);
      } else {
        console.error("Failed to delete invoice:", response.statusText);
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      let url = "http://localhost:8081/api/getinvoices";
      if (searchQuery.trim() !== "") {
        url += `?search=${searchQuery}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Assuming each invoice object has a 'services' property
        const invoicesWithServices = data.map((invoice) => ({
          ...invoice,
          services: invoice.services || [],
        }));
        setInvoices(invoicesWithServices);
        console.log(data);
      } else {
        console.error("Failed to fetch invoices:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearch = () => {
    fetchInvoices();
  };

  const handleaddinvoicesbuttonClick = () => {
    // Navigate to another page (e.g., '/other-page')
    navigate("/invoice_clerk/addinvoices");
  };

  const handleDetailButtonClick = (invoiceId) => {
    navigate(`/invoice_clerk/invoicedetail/${invoiceId}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchInvoices();
    }
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="INVOICES" subtitle="" />
      <Box display="flex" justifyContent="flex-end">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleaddinvoicesbuttonClick}
          startIcon={<AddIcon fontSize="small" />}
          sx={{ justifyContent: "flex-end" }}
        >
          Add Invoices
        </Button>
      </Box>
      <Header title="" subtitle="List of Invoice Balances" />
      <Box display="flex" mt={"3px"}>
        <TextField
          id="search-bar"
          className="text"
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onKeyPress={handleKeyPress}
          label="Search by Case ID or Invoice Number"
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{
            ml: "20px",
            width: "350px",
          }}
        />
        <IconButton type="submit" aria-label="search" onClick={handleSearch}>
          <SearchIcon style={{ fill: "blue" }} />
        </IconButton>
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
          {"Are you sure you want to delete this Invoice?"}
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
            onClick={handleDeleteConfirmation} // Call handleDeleteConfirmation
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
          Invoice Deleted Successfully
        </MuiAlert>
      </Snackbar>
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
        }}
      >
        <DataGrid
          rows={invoices}
          columns={columns}
          getRowId={(row) => row.invoice_id}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
