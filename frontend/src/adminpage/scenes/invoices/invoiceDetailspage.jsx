import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  TextField,
  Typography,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import Header from "../../components/Header";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const InvoiceDetail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [invoiceRows, setInvoiceRows] = useState([
    {
      service: "",
      description: "",
      amount: 0, // Adding amount property to each row
      paidStatus: "Unpaid", // Adding paidStatus property to each row
    },
  ]);

  const handleSave = async () => {
    try {
      const itemsToAdd = invoiceRows.map((row) => ({
        service: row.service,
        description: row.description,
        amount: row.amount,
        paid_status: row.paidStatus || "Unpaid",
      }));

      console.log("Data to be sent to the backend:", itemsToAdd);

      const response = await fetch(
        `http://localhost:8081/api/addinvoiceitemforinvoice/${invoiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemsToAdd),
        }
      );

      if (response.ok) {
        fetchInvoiceDetail();
        console.log("Items added successfully!");
        setOpenModal(false);
      } else {
        console.error("Failed to add items:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding items:", error);
    }
  };

  const [selectedStatus, setSelectedStatus] = useState(["Paid", "Unpaid"]);
  const currentDate = new Date().toISOString().split("T")[0];
  const [note, setNote] = useState("");
  const [descriptions, setDescriptions] = useState([""]);
  const { invoiceId } = useParams();
  console.log("Invoice ID:", invoiceId);
  const [totalAmount, setTotalAmount] = useState(0);
  const [overallStatus, setOverallStatus] = useState("No items");

  const navigate = useNavigate();

  const handlebackbuttonClick = () => {
    // Navigate to another page (e.g., '/other-page')
    navigate("/invoice_clerk/invoices");
  };
  const [services, setServices] = useState([]);
  const [taxRate, setTaxRate] = useState(0.15);
  const [dueDate, setDueDate] = useState(currentDate);

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  // Function to calculate the total amount including tax
  const calculateTotalAmount = () => {
    if (!invoiceDetail || !invoiceDetail.items) {
      return 0;
    }

    // Calculate subtotal by summing up the amounts of all fetched items
    const subtotal = invoiceDetail.items.reduce(
      (total, item) => total + parseFloat(item.amount),
      0
    );

    // Calculate tax amount
    const taxAmount = subtotal * taxRate;

    // Calculate total amount including tax
    const totalAmount = subtotal + taxAmount;

    return totalAmount;
  };

  const calculateOverallStatus = () => {
    if (
      !invoiceDetail ||
      !invoiceDetail.items ||
      invoiceDetail.items.length === 0
    ) {
      return "No items";
    }

    const paidItems = invoiceDetail.items.filter(
      (item) => item.paid_status === "Paid"
    );
    const unpaidItems = invoiceDetail.items.filter(
      (item) => item.paid_status === "Unpaid"
    );

    if (paidItems.length === invoiceDetail.items.length) {
      return "Paid";
    } else if (unpaidItems.length === invoiceDetail.items.length) {
      return "Unpaid";
    } else {
      return "Partially Paid";
    }
  };

  const handleDescriptionChange = (event, index) => {
    const { value } = event.target;
    setInvoiceRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index].description = value;
      return updatedRows;
    });
  };

  const getDescriptionValue = (index) => {
    return descriptions[index] || "";
  };

  const [invoiceDetail, setInvoiceDetail] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const fetchInvoiceDetail = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/getinvoicebyid/${invoiceId}`
      );
      if (response.ok) {
        const data = await response.json();
        setInvoiceDetail(data);
        console.log("Fetched Invoice Detail:", data);

        // Assign the item_id of the first item in the items array to itemId
        if (data.items && data.items.length > 0) {
          setItemId(data.items[0].item_id);
          console.log("Assigned Item ID:", data.items[0].item_id);
        }
      } else {
        // Handle error response
        console.error("Failed to fetch invoice details:", response.statusText);
        // Display an error message to the user
        // Implement error handling logic here
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      // Display an error message to the user
      // Implement error handling logic here
    }
  };
  useEffect(() => {
    console.log("Invoice Rows:", invoiceRows);
  }, [invoiceRows]);

  useEffect(() => {
    // Adjust the fetch URL to include the invoiceId

    fetchInvoiceDetail();
    fetchServices();
  }, [invoiceId]);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State for delete confirmation dialog
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // State to track the index of the item to be deleted

  // Function to open the delete confirmation dialog
  const handleOpenDeleteConfirmation = (itemId) => {
    setSelectedItemIndex(itemId);
    setDeleteConfirmationOpen(true);
    console.log(itemId);
  };

  // Function to close the delete confirmation dialog
  const handleCloseDeleteConfirmation = () => {
    setSelectedItemIndex(null);
    setDeleteConfirmationOpen(false);
  };

  useEffect(() => {
    // Calculate total amount whenever invoiceRows changes
    const subtotal = invoiceRows.reduce(
      (total, row) => total + parseFloat(row.amount),
      0
    );
    setTotalAmount(subtotal + subtotal * 0.15); // Include tax

    // Calculate overall status whenever invoiceRows changes
    const paidItems = invoiceRows.filter((item) => item.paidStatus === "Paid");
    const unpaidItems = invoiceRows.filter(
      (item) => item.paidStatus === "Unpaid"
    );
    if (paidItems.length === invoiceRows.length) {
      setOverallStatus("Paid");
    } else if (unpaidItems.length === invoiceRows.length) {
      setOverallStatus("Unpaid");
    } else {
      setOverallStatus("Partially Paid");
    }
  }, [invoiceRows]);
  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/deleteinvoiceitem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: itemId }),
        }
      );
      console.log(itemId);
      if (response.ok) {
        fetchInvoiceDetail();
        console.log("Invoice item deleted successfully!");
      } else {
        console.error("Failed to delete invoice item:", response.statusText);
      }

      handleCloseDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting invoice item:", error);
    }
  };

  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  const handleOpenModal = () => {
    setOpenModal(true);
    setInvoiceRows([
      {
        service: "",
        description: "",
        amount: 0,
        paidStatus: "Unpaid",
      },
    ]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getServices");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  const handleOpenEditModal = (index) => {
    setSelectedItemIndex(index);
    setOpenEditModal(true);
    const itemId = invoiceDetail.items[index].item_id;
    console.log("Selected Item ID:", itemId);
    console.log("Selected Item Index:", index);
  };

  const handleCancelEdit = () => {
    // Implement canceling edit logic here
    setOpenEditModal(false);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleSaveEditChanges = async (itemId) => {
    try {
      const updatedItem = invoiceRows[selectedItemIndex];
      const response = await fetch("http://localhost:8081/api/edititem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: itemId,
          description: updatedItem.description,
          paidStatus: updatedItem.paidStatus,
        }),
      });

      if (response.ok) {
        console.log("Item updated successfully!");
        handleCloseEditModal();
        fetchInvoiceDetail();
      } else {
        console.error("Failed to update item:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleSaveButton = async () => {
    try {
      // Get the latest total amount and overall status
      const totalAmount = calculateTotalAmount();
      const overallStatus = calculateOverallStatus();

      // Send data to the backend only if either totalAmount or overallStatus has changed
      if (
        totalAmount !== invoiceDetail.total_amount ||
        overallStatus !== invoiceDetail.overall_status
      ) {
        const response = await fetch(
          `http://localhost:8081/api/editea`, // Adjust the endpoint URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoiceId: invoiceId,
              totalAmount: totalAmount,
              overallStatus: overallStatus,
              caseId: invoiceDetail?.case_id,
              Note: note,
            }),
          }
        );

        if (response.ok) {
          fetchInvoiceDetail();
          console.log("Invoice data saved successfully!");
          setOpenSnackbar(true);
        } else {
          console.error("Failed to save invoice data:", response.statusText);
        }
      } else {
        console.log("No changes detected. Skipping save operation.");
      }
    } catch (error) {
      console.error("Error saving invoice data:", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);

    setTimeout(() => {
      navigate("/invoice_clerk/invoices");
    });
  };

  const handleCancelButtonClick = () => {
    navigate("/invoice_clerk/invoices");
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handlebackbuttonClick}
          startIcon={<ArrowBackIosNewOutlinedIcon fontSize="small" />}
        >
          Back
        </Button>
      </Box>
      <Header
        title="Invoice Detail"
        subtitle=""
        color={colors.greenAccent[500]}
      />
      <Box
        sx={{ backgroundColor: `${colors.primary[400]}80` }}
        margin="20px"
        padding="30px"
        borderRadius="15px"
      >
        <Box
          container
          spacing={2}
          margin="20px"
          padding="30px"
          borderRadius="15px"
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                mt={2}
                sx={{ display: "flex", alignItems: "center", mt: "10px" }}
              >
                <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                  <Typography>Case Number:</Typography>
                </InputLabel>
                <TextField
                  name="Case ID"
                  value={invoiceDetail?.case_id}
                  variant="standard"
                  disabled
                />
              </Box>
            </Grid>
            <Grid item xs={6} display="grid" justifyContent="flex-end">
              <Box
                mt={2}
                sx={{ display: "flex", alignItems: "center", mt: "10px" }}
              >
                <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                  <Typography>Invoice Number:</Typography>
                </InputLabel>
                <TextField
                  name="InvoiceNumber"
                  value={invoiceDetail?.invoice_number}
                  variant="standard"
                  disabled
                />
              </Box>
              <Box
                mt={2}
                sx={{ display: "flex", alignItems: "center", mt: "10px" }}
              >
                <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                  <Typography>Invoice Date:</Typography>
                </InputLabel>
                <TextField
                  name="InvoiceDate"
                  type="date"
                  value={
                    invoiceDetail
                      ? invoiceDetail.invoice_date.split("T")[0]
                      : ""
                  }
                  variant="standard"
                  disabled
                  sx={{ width: "180px" }}
                />
              </Box>
              <Box
                mt={2}
                sx={{ display: "flex", alignItems: "center", mt: "10px" }}
              >
                <InputLabel sx={{ width: "150px", marginRight: "5px" }}>
                  <Typography>Invoice Due Date:</Typography>
                </InputLabel>
                <TextField
                  name="InvoiceDate"
                  type="date"
                  sx={{ width: "180px" }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={4}>
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: `${colors.primary[400]}80` }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "300px" }}>Services</TableCell>
                <TableCell sx={{ width: "300px" }}>Description</TableCell>

                <TableCell sx={{ width: "200px" }}>Amount</TableCell>
                <TableCell sx={{ width: "200px" }}>Status</TableCell>
                <TableCell sx={{ width: "100px" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceDetail && // Render table rows in view mode if invoice detail is available
                invoiceDetail.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.paid_status}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenEditModal(index)}
                        aria-label="edit"
                      >
                        <EditIcon color="success" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          handleOpenDeleteConfirmation(item.item_id)
                        } // Pass the item_id to the handler
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600, // Adjust the width as needed
              bgcolor: `${colors.blueAccent[900]}`,
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <DialogTitle>Edit Item</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="row" gap={2}>
                <TextField
                  fullWidth
                  label="Description"
                  value={invoiceRows[selectedItemIndex]?.description || ""}
                  onChange={(e) => {
                    const updatedRows = [...invoiceRows];
                    updatedRows[selectedItemIndex] = {
                      ...updatedRows[selectedItemIndex],
                      description: e.target.value,
                    };
                    setInvoiceRows(updatedRows);
                  }}
                />

                <Select
                  fullWidth
                  value={invoiceRows[selectedItemIndex]?.paidStatus || ""}
                  onChange={(e) => {
                    const updatedRows = [...invoiceRows];
                    updatedRows[selectedItemIndex] = {
                      ...updatedRows[selectedItemIndex],
                      paidStatus: e.target.value,
                    };
                    setInvoiceRows(updatedRows);
                  }}
                >
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Unpaid">Unpaid</MenuItem>
                </Select>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="outlined"
                onClick={() =>
                  handleSaveEditChanges(
                    invoiceDetail.items[selectedItemIndex].item_id
                  )
                }
              >
                Save
              </Button>
            </DialogActions>
          </Box>
        </Modal>
        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleCloseDeleteConfirmation}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDeleteConfirmation}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteItem(selectedItemIndex)}
              variant="outlined"
              color="error"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Box mt={2} display="flex">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenModal}
          >
            Add More
          </Button>
          {/* Modal */}
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 800, // Adjust the width as needed
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-title" variant="h6" component="h2">
                Add More Items
              </Typography>
              <Box mt={2}>
                {invoiceRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        fullWidth
                        value={row.service}
                        onChange={(e) => {
                          const selectedService = services.find(
                            (service) => service.name === e.target.value
                          );
                          if (selectedService) {
                            const updatedRows = [...invoiceRows];
                            updatedRows[index].service = selectedService.name;
                            updatedRows[index].amount = selectedService.amount;
                            setInvoiceRows(updatedRows);
                          }
                        }}
                        sx={{ width: "100%" }}
                      >
                        {services
                          .filter(
                            (service) =>
                              !invoiceDetail ||
                              !invoiceDetail.items.some(
                                (item) => item.service === service.name
                              )
                          )
                          .map((service) => (
                            <MenuItem key={service.id} value={service.name}>
                              {service.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          onChange={(e) => handleDescriptionChange(e, index)}
                          multiline
                          value={invoiceRows[index].description}
                        />
                      </TableCell>
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={row.amount} // Use the amount from the row
                        InputProps={{
                          readOnly: true,
                          endAdornment: <span>&nbsp;Birr</span>,
                        }}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        fullWidth
                        value={row.paidStatus}
                        onChange={(event) => {
                          const updatedRows = [...invoiceRows];
                          updatedRows[index].paidStatus = event.target.value;
                          setInvoiceRows(updatedRows);
                        }}
                      >
                        {selectedStatus.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </Box>
              <Box gap={2} mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button variant="outlined" onClick={handleSave} color="success">
                  Save
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>

        <Box mt={2} sx={{ display: "flex", mt: "40px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                multiline
                rows={5}
                fullWidth
                id="Note"
                name="Note"
                label="Note..."
                variant="outlined"
                value={note}
                onChange={handleNoteChange}
                sx={{ mt: 2, ml: "20px", pr: "10px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <Box display={"flex"} alignItems="center">
                <Typography sx={{ mt: "20px", ml: "10px" }} variant="h6">
                  TAX:
                </Typography>
                <TextField
                  disabled
                  variant="outlined"
                  value="15%"
                  sx={{ width: "15%", mt: "7px", ml: "2%" }}
                />
              </Box>
              <Box display={"flex"} alignItems="center">
                <Typography sx={{ mt: "20px", ml: "10px" }} variant="h6">
                  Status:
                </Typography>
                <TextField
                  disabled
                  variant="outlined"
                  value={calculateOverallStatus()}
                  sx={{ width: "20%", mt: "7px", ml: "2%" }}
                />
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <InputLabel sx={{ width: "150px" }}>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    Total Amount:
                  </Typography>
                </InputLabel>
                <TextField
                  name="Total"
                  InputProps={{
                    readOnly: true,
                    endAdornment: <span>&nbsp;Birr</span>,
                  }}
                  value={calculateTotalAmount()} // Display the calculated total amount
                  sx={{ width: "20%" }}
                  disabled
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            mt: "30px",
            display: "flex",
            justifyContent: "flex-end",
            mb: "50px",
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="error"
            sx={{ mt: "10px" }}
            size="large"
            onClick={handleCancelButtonClick}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="success"
            size="large"
            sx={{ mt: "10px", ml: "10px" }}
            startIcon={<SaveIcon />}
            onClick={handleSaveButton}
          >
            Save
          </Button>
        </Box>
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
            Invoice Edited Successfully
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default InvoiceDetail;
