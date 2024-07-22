import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  TextField,
  Typography,
  Autocomplete,
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
  Popper,
  Fade,
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
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import SaveIcon from "@mui/icons-material/Save";

const AddInvoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [invoiceRows, setInvoiceRows] = useState([
    {
      service: "",
      description: "",
      amount: 0, // Adding amount property to each row
      paidStatus: "Unpaid", // Adding paidStatus property to each row
    },
  ]);

  const handleAddMore = () => {
    setInvoiceRows((prevRows) => [
      ...prevRows,
      {
        service: "",
        description: "", // Reset description to an empty string for the new row
        amount: 0,
        paidStatus: "Unpaid",
      },
    ]);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(["Paid", "Unpaid"]);
  const currentDate = new Date().toISOString().split("T")[0];
  const [note, setNote] = useState("");
  const [descriptions, setDescriptions] = useState([""]);
  const [fetchedCases, setFetchedCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleActionClick = (event, index) => {
    if (anchorEl && index === selectedRow) {
      // Clicked again on the same row, close the Popper
      setAnchorEl(null);
    } else {
      // Clicked on a different row or the Popper is not open, open the Popper
      setSelectedRow(index);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleEdit = () => {
    // Add your edit logic here
    setAnchorEl(null);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleRemove = () => {
    setInvoiceRows((prevRows) =>
      prevRows.filter((row, index) => index !== selectedRow)
    );
    setAnchorEl(null);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handlebackbuttonClick = () => {
    // Navigate to another page (e.g., '/other-page')
    navigate("/invoice_clerk/invoices");
  };
  const [services, setServices] = useState([]);
  const [taxRate, setTaxRate] = useState(0.15);
  const [dueDate, setDueDate] = useState(currentDate);

  useEffect(() => {
    fetchServices();
    fetchCaseCount();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getServices");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  // Function to calculate the total amount including tax
  const calculateTotalAmount = () => {
    const subTotal = invoiceRows.reduce((total, row) => total + row.amount, 0);
    const taxAmount = subTotal * taxRate;
    return subTotal + taxAmount;
  };

  // Function to determine the overall status
  const calculateOverallStatus = () => {
    const allPaid = invoiceRows.every((row) => row.paidStatus === "Paid");
    const allUnpaid = invoiceRows.every((row) => row.paidStatus === "Unpaid");
    if (allPaid) {
      return "Paid";
    } else if (allUnpaid) {
      return "Unpaid";
    } else {
      return "Partially Paid";
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        case_id: selectedCase?.case_id || "",
        invoice_number: invoiceNumber,
        invoice_date: currentDate,
        due_date: dueDate,
        note: note,
        total_amount: calculateTotalAmount(),
        paid_status: calculateOverallStatus(),
        items: invoiceRows.map((row, index) => ({
          service: row.service,
          description: descriptions[index],
          amount: row.amount,
          paid_status: row.paidStatus,
        })),
      };

      const response = await fetch("http://localhost:8081/api/addInvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setOpenSnackbar(true);
        setInvoiceRows([
          {
            service: "",
            description: "",
            amount: 0,
            paidStatus: "Unpaid",
          },
        ]);
        setSelectedCase(null);
        setNote("");
        setDueDate(currentDate);
        setDescriptions([""]);
        fetchHighestInvoiceNumber();
      } else {
        console.error("Failed to save invoice:", response.statusText);
        // Handle the error or show an error message
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      // Handle the error or show an error message
    }
  };
  const handleDescriptionChange = (event, index) => {
    const { value } = event.target;
    setDescriptions((prevDescriptions) => {
      const updatedDescriptions = [...prevDescriptions];
      updatedDescriptions[index] = value;
      return updatedDescriptions;
    });
  };
  const getDescriptionValue = (index) => {
    return descriptions[index] || "";
  };

  useEffect(() => {
    fetchHighestInvoiceNumber();
  }, []);

  const [invoiceNumber, setInvoiceNumber] = useState("");

  const fetchHighestInvoiceNumber = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/gethighestinvoice"
      );
      const data = await response.json();
      const nextInvoiceNumber = data.highestNumber + 1;
      setInvoiceNumber(`INV-${nextInvoiceNumber}`);
    } catch (error) {
      console.error("Error fetching highest invoice number: ", error);
    }
  };

  const fetchCaseCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/fetchcaseinformation"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch case count");
      }
      const data = await response.json();
      setFetchedCases(data);
    } catch (error) {
      console.error("Error fetching case count:", error);
    }
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
        title="Add Invoices"
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
              <Autocomplete
                options={fetchedCases}
                getOptionLabel={(option) => option.case_id.toString()}
                value={selectedCase}
                onChange={(event, newValue) => {
                  setSelectedCase(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Case Number"
                    variant="outlined"
                  />
                )}
                openOnFocus
                autoHighlight
                fullWidth
                sx={{ mt: "10px" }}
              />
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
                  variant="standard"
                  value={invoiceNumber}
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
                  value={currentDate}
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
                          updatedRows[index].amount = selectedService.amount; // Update the amount
                          setInvoiceRows(updatedRows);
                        }
                      }}
                    >
                      {services
                        .filter(
                          (service) =>
                            !invoiceRows
                              .slice(0, index)
                              .map((row) => row.service)
                              .includes(service.name)
                        )
                        .map((service) => (
                          <MenuItem key={service.id} value={service.name}>
                            {service.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      onChange={(e) => handleDescriptionChange(e, index)} // Update description for the corresponding row
                      multiline
                      value={getDescriptionValue(index)} // Pass description value for the corresponding row
                    />
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
                      value={row.paidStatus} // Set the value to the paidStatus property of the row
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
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleActionClick(event, index)}
                    >
                      <MoreVertOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex">
          <Button variant="contained" color="secondary" onClick={handleAddMore}>
            Add More
          </Button>
        </Box>
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="bottom"
          transition
          onClose={handleClosePopper}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <ClickAwayListener onClickAway={handleClosePopper}>
                  <MenuList>
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleRemove}>Remove</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
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
            onClick={handleSave}
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
            Invoice Added Successfully
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddInvoices;
