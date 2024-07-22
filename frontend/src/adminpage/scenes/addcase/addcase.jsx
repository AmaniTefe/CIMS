import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Form, Formik } from "formik";
import * as yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Snackbar } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditCase from "../form/editcaseform";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"; // Import necessary modules
const initialValues = {};

const checkoutSchema = yup.object().shape({});

const AddCase = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);

  const fetchCaseCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/fetchcaseinformation"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch case count");
      }
      const data = await response.json();
      console.log("Fetched case count:", data);
      setFetchedCases(data);
    } catch (error) {
      console.error("Error fetching case count:", error);
    }
  };

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const memoizedFetchCases = useMemo(() => fetchCaseCount, []);

  const [fetchedCases, setFetchedCases] = useState([]);
  const [expandedCases, setExpandedCases] = useState({});
  const [referencesVisible, setReferencesVisible] = useState({});
  const [enteredCaseId, setEnteredCaseId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [openCaseFormDialog, setOpenCaseFormDialog] = useState(false);
  const [isEditFormClosed, setIsEditFormClosed] = useState(false);
  const [documentRows, setDocumentRows] = useState([]); // State variable to store document rows
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showPDF, setShowPDF] = React.useState(false);
  // Function to toggle showing the PDF
  const [openSnackbar1, setOpenSnackbar1] = useState(false);
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      backgroundColor: `${colors.primary[600]}`,
      color: `${colors.primary[100]}`,
      borderRadius: "10px",
    },
  });
  const PDFComponent = ({ judgeDecision }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>
            <div dangerouslySetInnerHTML={{ __html: judgeDecision }} />
          </Text>
        </View>
      </Page>
    </Document>
  );
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const handleClick = () => {
    navigate(`/registrar/caseform`);
  };
  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar1(false);
  };
  const [documentDescriptions, setDocumentDescriptions] = useState({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const addDocumentRow = (caseId) => {
    // Find the case by its ID
    const foundCase = fetchedCases.find(
      (caseData) => caseData.case_id === caseId
    );
    if (foundCase) {
      // Add a new document row to the case
      const updatedCases = fetchedCases.map((caseData) =>
        caseData.case_id === caseId
          ? {
              ...caseData,
              documentRows: [
                ...(caseData.documentRows || []),
                { description: "", file: null },
              ],
            }
          : caseData
      );
      setFetchedCases(updatedCases);
      setShowSubmitButton(true);
    }
  };

  const removeDocumentRow = (caseId, rowIndex) => {
    // Remove the document row from the case
    const updatedCases = fetchedCases.map((caseData) =>
      caseData.case_id === caseId
        ? {
            ...caseData,
            documentRows: caseData.documentRows.filter(
              (_, index) => index !== rowIndex
            ),
          }
        : caseData
    );
    setFetchedCases(updatedCases);
  };
  // Function to handle document description change
  const handleDescriptionChange = (caseId, rowIndex, description) => {
    // Update the description of the document row
    const updatedCases = fetchedCases.map((caseData) =>
      caseData.case_id === caseId
        ? {
            ...caseData,
            documentRows: caseData.documentRows.map((row, index) =>
              index === rowIndex ? { ...row, description: description } : row
            ),
          }
        : caseData
    );
    setFetchedCases(updatedCases);
  };
  const handleFileUpload = async (caseId, rowIndex, file) => {
    try {
      // Update the file of the document row
      const updatedCases = fetchedCases.map((caseData) =>
        caseData.case_id === caseId
          ? {
              ...caseData,
              documentRows: caseData.documentRows.map((row, index) =>
                index === rowIndex ? { ...row, file: file } : row
              ),
            }
          : caseData
      );
      setFetchedCases(updatedCases);

      // Create a FormData object
      const formData = new FormData();
      // Append the file to the FormData object
      formData.append("file", file);
      // Append other data (caseId, rowIndex) to the FormData object
      formData.append("caseId", caseId);
      formData.append("rowIndex", rowIndex);

      // Make a POST request to the API endpoint
      const response = await fetch(
        "http://localhost:8081/api/uploaddocumentss",
        {
          method: "POST",
          body: formData,
        }
      );

      // Check if the request was successful
      if (response.ok) {
        // Extract the response data if needed
        const data = await response.json();
        console.log("File uploaded successfully:", data);
        // Handle the response as needed
      } else {
        // Handle the error if the request was not successful
        console.error("Failed to upload file:", response.statusText);
      }
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error uploading file:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const casesData = await memoizedFetchCases();
        setCases(casesData);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData(); // Fetch data on component mount
  }, [memoizedFetchCases]);

  useEffect(() => {
    fetchCaseCount();
    if (!openCaseFormDialog && isEditFormClosed) {
      fetchCaseCount();
    }
  }, [openCaseFormDialog, isEditFormClosed]);

  const toggleCaseDetails = (caseId) => {
    setExpandedCases((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));

    setReferencesVisible((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));
  };

  const deleteCase = (caseId) => {
    setCaseToDelete(caseId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (caseToDelete) {
      await deleteCaseFromServer(caseToDelete);
      setOpenDeleteDialog(false);
    }
  };

  const deleteCaseFromServer = async (caseId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/deletecase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: caseId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete case");
      }
      setFetchedCases((prevCases) =>
        prevCases.filter((caseData) => caseData.case_id !== caseId)
      );
      handleSnackbarOpen();
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  const handleFormSubmit = (values) => {
    setErrorMessage("");

    const enteredCaseIdNumber = parseInt(enteredCaseId);

    console.log("Entered Case ID:", enteredCaseIdNumber);

    const foundCase = fetchedCases.find(
      (caseData) => caseData.case_id === enteredCaseIdNumber
    );
    if (foundCase) {
      console.log("Found Case ID:", foundCase.case_id);
      const foundCaseRef = document.getElementById(`case-${foundCase.case_id}`);
      if (foundCaseRef) {
        foundCaseRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setErrorMessage("the case number you entered does not match");
    }
  };
  const handleSubmits = async () => {
    const submittedData = [];

    fetchedCases.forEach((caseData) => {
      if (caseData.documentRows && caseData.documentRows.length > 0) {
        caseData.documentRows.forEach(async (row) => {
          const submittedRow = {
            caseId: caseData.case_id,
            description: row.description,
            fileName: row.file ? row.file.name : null,
          };

          submittedData.push(submittedRow);

          try {
            const response = await fetch(
              "http://localhost:8081/api/uploadothercase",
              {
                // Use provided endpoint
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(submittedRow),
              }
            );

            // Check if the request was successful
            if (response.ok) {
              // Log success message or handle response data
              console.log("Data submitted successfully:", submittedRow);
            } else {
              // Handle error response
              console.error("Failed to submit data:", response.statusText);
            }
          } catch (error) {
            // Handle any network errors or exceptions
            console.error("Error submitting data:", error.message);
          }
        });
      }
    });

    console.log("Submitted Data:", submittedData);
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Case Management" subtitle="" />

      <Box display="flex" justifyContent="end" mt="10px">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
          startIcon={<AddIcon fontSize="small" />}
          mb="10px"
        >
          Add Case
        </Button>
      </Box>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="flex" mt={"20px"}>
              {/* First search bar */}
              <TextField
                id="search-bar-case-number"
                className="text"
                value={enteredCaseId}
                onChange={(e) => {
                  const regex = /^[0-9]*$/;
                  if (regex.test(e.target.value) || e.target.value === "") {
                    setEnteredCaseId(e.target.value);
                  }
                }}
                label="Search Case by Case Number"
                variant="filled"
                placeholder="Search..."
                size="medium"
                sx={{
                  ml: "20px",
                  width: "350px",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" aria-label="search">
                        <SearchIcon style={{ fontSize: "30px" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {errorMessage && (
              <Typography color="error" padding={3} mt={1}>
                {errorMessage}
              </Typography>
            )}
            <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
              <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="md"
              >
                <DialogTitle
                  bgcolor={colors.blueAccent[900]}
                  id="form-dialog-title"
                >
                  Edit Case
                </DialogTitle>
                <DialogContent
                  style={{ backgroundColor: `${colors.blueAccent[900]}` }}
                >
                  {isDialogOpen && (
                    <EditCase
                      caseId={selectedCaseId}
                      onCloseDialog={handleCloseDialog}
                      setOpenSnackbar1={setOpenSnackbar1}
                    />
                  )}
                </DialogContent>
                <DialogActions
                  style={{ backgroundColor: `${colors.blueAccent[900]}` }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    sx={{ mt: "10px" }}
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  {/* You can handle form submission or other actions here */}
                </DialogActions>
              </Dialog>
            </Box>
            <Box
              sx={{ mt: "10px" }}
              padding="5px"
              backgroundColor={colors.blueAccent[900]}
            >
              <Box m="40px 0 0 0">
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MuiAlert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    Case Deleted Successfully
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
                    Case Edited Successfully
                  </MuiAlert>
                </Snackbar>
                <>
                  {fetchedCases.map((caseData) => (
                    <Box
                      id={`case-${caseData.case_id}`}
                      key={caseData.case_id}
                      borderRadius={4}
                      p={3}
                      mt={2}
                      bgcolor={`${colors.primary[400]}80`}
                    >
                      <Box display="flex" alignItems="center" p={2}>
                        <Typography
                          marginBottom={2}
                          style={{
                            fontWeight: "bold",
                            color: colors.greenAccent[300],
                          }}
                          variant="h3"
                          color="#5bc0de"
                          flexGrow={1} // Grow to fill available space
                        >
                          Case Number {caseData.case_id}
                        </Typography>
                        <Typography
                          marginBottom={2}
                          style={{
                            fontWeight: "bold",
                            color: colors.greenAccent[300],
                          }}
                          variant="h3"
                          color="#5bc0de"
                          flexGrow={1} // Grow to fill available space
                        >
                          Case Status{" "}
                          <span style={{ color: colors.blueAccent[500] }}>
                            {caseData.case_status}
                          </span>
                        </Typography>
                        <Box>
                          <Button
                            style={{ margin: "10px" }}
                            variant="contained"
                            color="secondary"
                            onClick={handleOpenDialog}
                          >
                            Edit Case
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteCase(caseData.case_id)}
                          >
                            Delete Case
                          </Button>
                        </Box>
                      </Box>
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xs={12}
                          md={4.5}
                          margin={1}
                          borderRadius={3}
                          bgcolor={`${colors.primary[400]}40`}
                          boxShadow={10}
                        >
                          <Box padding={2}>
                            <Typography
                              variant="h3"
                              color="#5bc0de"
                              style={{ fontWeight: "bold" }}
                              textAlign={"center"}
                            >
                              Case Information
                            </Typography>
                            <Typography
                              variant="h4"
                              margin={1}
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Case Type{" "}
                              <span
                                style={{
                                  color: colors.greenAccent[300],
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                {caseData.case_type}
                              </span>
                            </Typography>
                            <Typography
                              variant="h4"
                              margin={1}
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Case Sub Type{" "}
                              <span
                                style={{
                                  color: colors.greenAccent[300],
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                {caseData.sub_type_name}
                              </span>
                            </Typography>
                            <Typography
                              variant="h4"
                              margin={1}
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              FIR Date{" "}
                              <span
                                style={{
                                  color: colors.greenAccent[300],

                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                {caseData.FIRDate}
                              </span>
                            </Typography>
                            <Typography
                              variant="h4"
                              margin={1}
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              FIR Number{" "}
                              <span
                                style={{
                                  color: colors.greenAccent[300],
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                {caseData.FIRNumber}
                              </span>
                            </Typography>
                            <Typography
                              variant="h4"
                              margin={1}
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Registration Date{" "}
                              <span
                                style={{
                                  color: colors.greenAccent[300],
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                {caseData.registrationDate}
                              </span>
                            </Typography>
                            {expandedCases[caseData.case_id] && (
                              <>
                                {caseData.case_type === "criminal" && (
                                  <Typography
                                    variant="h4"
                                    margin={1}
                                    color={colors.grey[100]}
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "1.1em",
                                    }}
                                  >
                                    Police Station{" "}
                                    <span
                                      style={{
                                        color: colors.greenAccent[300],
                                        fontWeight: "bold",
                                        fontSize: "1.1em",
                                      }}
                                    >
                                      {caseData.policeStation}
                                    </span>
                                  </Typography>
                                )}
                              </>
                            )}

                            {caseData.petitioner_advocate_info &&
                              caseData.petitioner_advocate_info.first_name &&
                              caseData.petitioner_advocate_info.last_name && (
                                <Typography
                                  variant="h4"
                                  margin={1}
                                  color={colors.grey[100]}
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "1.1em",
                                  }}
                                >
                                  Petitioner Advocate{" "}
                                  <span
                                    style={{
                                      color: colors.greenAccent[300],
                                      fontWeight: "bold",
                                      fontSize: "1.1em",
                                    }}
                                  >{`${caseData.petitioner_advocate_info.first_name} ${caseData.petitioner_advocate_info.last_name}`}</span>
                                </Typography>
                              )}
                            {caseData.prosecutor_info &&
                              caseData.prosecutor_info.first_name &&
                              caseData.prosecutor_info.last_name && (
                                <Typography
                                  variant="h4"
                                  margin={1}
                                  color={colors.grey[100]}
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "1.1em",
                                  }}
                                >
                                  Prosecutor{" "}
                                  <span
                                    style={{
                                      color: colors.greenAccent[300],
                                      fontWeight: "bold",
                                      fontSize: "1.1em",
                                    }}
                                  >{`${caseData.prosecutor_info.first_name} ${caseData.prosecutor_info.last_name}`}</span>
                                </Typography>
                              )}
                            <Typography
                              variant="h4"
                              margin={1}
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Respondent Advocate{" "}
                              {caseData.respondent_advocate_info ? (
                                <span
                                  style={{
                                    color: colors.greenAccent[300],
                                    fontWeight: "bold",
                                    fontSize: "1.1em",
                                  }}
                                >{`${caseData.respondent_advocate_info.first_name} ${caseData.respondent_advocate_info.last_name}`}</span>
                              ) : (
                                "N/A"
                              )}
                            </Typography>
                            {caseData.id && caseData.first_name ? (
                              <Typography
                                variant="h4"
                                margin={1}
                                color={colors.grey[100]}
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                Assigned Judge:{" "}
                                <span
                                  style={{
                                    color: colors.greenAccent[300],
                                    fontWeight: "bold",
                                    fontSize: "1.1em",
                                  }}
                                >
                                  {`${caseData.id} / ${caseData.first_name} / ${caseData.last_name}`}
                                </span>
                              </Typography>
                            ) : (
                              <Typography
                                variant="h4"
                                margin={1}
                                color={colors.grey[100]}
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                Case is not assigned yet
                              </Typography>
                            )}

                            {caseData.file_path && ( // Check if file_path exists
                              <>
                                {/* Display the document icon with a link to download the file */}
                                <a
                                  href={`http://localhost:8081/${caseData.file_path}`}
                                  download
                                >
                                  <Button
                                    component="span"
                                    variant="contained"
                                    size="large"
                                  >
                                    <DescriptionOutlinedIcon
                                      style={{ fontSize: "30px" }}
                                    />
                                    viaw case Document
                                  </Button>
                                </a>
                              </>
                            )}
                          </Box>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          boxShadow={10}
                          borderRadius={3}
                          margin={1}
                          bgcolor={`${colors.primary[400]}40`}
                          md={3.6}
                        >
                          {caseData.petitioners_info && (
                            <Box padding={2}>
                              <Typography
                                variant="h3"
                                color="#5bc0de"
                                style={{ fontWeight: "bold" }}
                                textAlign={"center"}
                              >
                                Petitioners
                              </Typography>
                              {caseData.petitioners_info.map(
                                (petitioner, index) => (
                                  <Box
                                    key={index}
                                    borderBottom={3}
                                    mt={1}
                                    padding={1}
                                    borderRadius={2}
                                    borderColor={colors.blueAccent[800]}
                                    marginLeft={2}
                                    marginRight={2}
                                  >
                                    <Typography
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "1.1.1em",
                                      }}
                                      variant="body1"
                                      color={colors.grey[100]}
                                    >
                                      Full Name{" "}
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "1.1em",
                                          color: colors.greenAccent[300],
                                        }}
                                      >{`${petitioner.first_name} ${petitioner.middle_name} ${petitioner.last_name}`}</span>
                                    </Typography>

                                    {expandedCases[caseData.case_id] && (
                                      <>
                                        <Typography
                                          variant="body1"
                                          color={colors.grey[100]}
                                        >{`Email:  ${petitioner.email}`}</Typography>
                                        <Typography
                                          variant="body1"
                                          color={colors.grey[100]}
                                        >{`Phone Number:  ${petitioner.mobile_number}`}</Typography>
                                      </>
                                    )}
                                    {/* Render other petitioner info */}
                                    {expandedCases[caseData.case_id] && (
                                      <>
                                        <Typography
                                          variant="h5"
                                          color={colors.blueAccent[300]}
                                        >
                                          Reference Information
                                        </Typography>
                                        {petitioner.references &&
                                          petitioner.references.map(
                                            (reference, index) => (
                                              <Box
                                                key={index}
                                                color={colors.greenAccent[300]}
                                                mt={1}
                                              >
                                                <Typography
                                                  variant="body1"
                                                  color={colors.grey[100]}
                                                >{`Reference Name: ${reference.reference_name}`}</Typography>
                                                <Typography
                                                  variant="body1"
                                                  color={colors.grey[100]}
                                                >{`Reference Mobile: ${reference.reference_mobile}`}</Typography>
                                              </Box>
                                            )
                                          )}
                                      </>
                                    )}
                                  </Box>
                                )
                              )}
                            </Box>
                          )}
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={3.4}
                          margin={1}
                          borderRadius={3}
                          bgcolor={`${colors.primary[400]}40`}
                          boxShadow={10}
                        >
                          {caseData.respondents_info && (
                            <Box padding={2}>
                              <Typography
                                variant="h3"
                                color="#5bc0de"
                                style={{ fontWeight: "bold" }}
                                textAlign={"center"}
                              >
                                Respondents
                              </Typography>
                              {caseData.respondents_info.map(
                                (respondent, index) => (
                                  <Box
                                    key={index}
                                    borderBottom={3}
                                    mt={1}
                                    padding={1}
                                    borderRadius={2}
                                    borderColor={colors.blueAccent[800]}
                                    marginLeft={2}
                                    marginRight={2}
                                  >
                                    <Typography
                                      variant="body1"
                                      color={colors.grey[100]}
                                    >
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "1.1.1em",
                                        }}
                                      >
                                        Full Name
                                      </span>
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "1.1.1em",
                                          color: colors.greenAccent[300],
                                        }}
                                      >
                                        {`${respondent.first_name} ${respondent.middle_name} ${respondent.last_name}`}
                                      </span>
                                    </Typography>

                                    {expandedCases[caseData.case_id] && (
                                      <>
                                        <Typography
                                          variant="body1"
                                          color={colors.grey[100]}
                                        >{`Email: ${respondent.email}`}</Typography>
                                        <Typography
                                          variant="body1"
                                          color={colors.grey[100]}
                                        >{`Phone Number: ${respondent.mobile_number}`}</Typography>
                                      </>
                                    )}
                                    {/* Render other respondent info */}
                                    {expandedCases[caseData.case_id] && (
                                      <>
                                        <Typography
                                          variant="h5"
                                          color={colors.blueAccent[300]}
                                        >
                                          References Information
                                        </Typography>
                                        {respondent.references &&
                                          respondent.references.map(
                                            (reference, index) => (
                                              <Box key={index} mt={1}>
                                                <Typography
                                                  variant="body1"
                                                  color={colors.grey[100]}
                                                >{`Reference Name: ${reference.reference_name}`}</Typography>
                                                <Typography
                                                  variant="body1"
                                                  color={colors.grey[100]}
                                                >{`Reference Mobile: ${reference.reference_mobile}`}</Typography>
                                              </Box>
                                            )
                                          )}
                                      </>
                                    )}
                                  </Box>
                                )
                              )}
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                      {expandedCases[caseData.case_id] && (
                        <Grid container m={0.1} boxShadow={10} padding={1}>
                          <Grid item xs={10}>
                            <Typography
                              variant="h3"
                              color="#5bc0de"
                              style={{ fontWeight: "bold" }}
                            >
                              Case Related Documents
                            </Typography>
                          </Grid>
                          {caseData.other_documents_info &&
                          caseData.other_documents_info.length > 0 ? (
                            caseData.other_documents_info.map((doc, index) =>
                              // Check if id is not null before displaying the document
                              doc.id !== null ? (
                                <Grid
                                  item
                                  key={index}
                                  xs={12}
                                  sm={8}
                                  md={6}
                                  lg={7}
                                  padding={2}
                                  xl={6}
                                >
                                  <Grid
                                    container
                                    borderRadius={3}
                                    spacing={0.1}
                                    padding={2}
                                    margin={1}
                                    bgcolor={`${colors.primary[400]}40`}
                                    boxShadow={10}
                                  >
                                    <Grid item xs={7.9}>
                                      <Typography
                                        variant="body1"
                                        color={colors.grey[100]}
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "1.1em",
                                          marginBottom: "0.5em",
                                        }}
                                      >
                                        Document Description{" "}
                                        <span
                                          style={{
                                            color: colors.greenAccent[300],
                                          }}
                                        >
                                          {doc.description}
                                        </span>
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <a
                                        style={{ fontSize: "30px" }}
                                        href={`http://localhost:8081/${doc.file_path}`}
                                        download
                                      >
                                        <Button
                                          component="span"
                                          variant="contained"
                                          size="large"
                                          style={{ width: "180px" }} // Adjust the width as needed
                                        >
                                          <DescriptionOutlinedIcon
                                            style={{ fontSize: "25px" }}
                                          />
                                          <h5 style={{ fontSize: "12px" }}>
                                            {doc.file_path}
                                          </h5>
                                        </Button>
                                      </a>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ) : (
                                // Handle the case when id is null
                                <Grid
                                  item
                                  key={index}
                                  xs={12}
                                  sm={8}
                                  md={6}
                                  lg={7}
                                  padding={2}
                                  xl={6}
                                >
                                  <Typography
                                    variant="body1"
                                    color={colors.grey[100]}
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "1.1em",
                                    }}
                                  >
                                    No data
                                  </Typography>
                                </Grid>
                              )
                            )
                          ) : (
                            // Handle the case when other_documents_info is empty or undefined
                            <Typography
                              variant="body1"
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              No data
                            </Typography>
                          )}
                        </Grid>
                      )}

                      <Grid container justifyContent="flex-end" mt={2} pr={2}>
                        <Grid item boxShadow={10}>
                          <Box mt={2}>
                            <Button
                              type="button"
                              variant="contained"
                              color="secondary"
                              onClick={() => addDocumentRow(caseData.case_id)}
                            >
                              Add Document
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                      {caseData.documentRows &&
                        caseData.documentRows.map((row, index) => (
                          <Grid
                            key={index}
                            container
                            spacing={2}
                            alignItems="center"
                          >
                            <Grid item marginBottom={2} xs={7}>
                              {/* Text field for document description */}
                              <TextField
                                label="Document Description"
                                variant="outlined"
                                fullWidth
                                value={row.description}
                                onChange={(e) =>
                                  handleDescriptionChange(
                                    caseData.case_id,
                                    index,
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={3.5}>
                              {/* File input for document upload */}
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileUpload(
                                    caseData.case_id,
                                    index,
                                    e.target.files[0]
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={1}>
                              {/* Button to remove the document row */}
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  removeDocumentRow(caseData.case_id, index)
                                }
                              >
                                Remove
                              </Button>
                            </Grid>
                          </Grid>
                        ))}

                      {/* Button to add a new document row */}
                      {documentRows.map((rowId) => (
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                          key={rowId}
                        >
                          <Grid item xs={8}>
                            {/* Text field for document description */}
                            <TextField
                              label="Document Description"
                              required
                              variant="outlined"
                              fullWidth
                              value={documentDescriptions[rowId]}
                              onChange={(e) =>
                                handleDescriptionChange(rowId, e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={2}>
                            {/* File input for document upload */}
                            <input
                              required
                              type="file"
                              onChange={(e) =>
                                handleFileUpload(rowId, e.target.files[0])
                              }
                            />
                          </Grid>
                          <Grid item justifyContent="flex-end" xs={1}>
                            {/* Button to remove the document row */}
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => removeDocumentRow(rowId)}
                            >
                              Remove
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                      {showSubmitButton &&
                        fetchedCases.some(
                          (caseData) =>
                            caseData.documentRows &&
                            caseData.documentRows.length > 0
                        ) && (
                          <Grid container mt={2} spacing={2}>
                            <Grid
                              item
                              xs={12}
                              marginRight={3}
                              container
                              justifyContent="flex-end"
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmits}
                              >
                                Submit
                              </Button>
                            </Grid>
                          </Grid>
                        )}

                      {expandedCases[caseData.case_id] && (
                        <>
                          <TextField
                            style={{
                              margin: "10px",
                              fontSize: "40px",
                              backgroundColor: `${colors.blueAccent[900]}50`,
                              color: `${colors.primary[100]}`,
                            }}
                            multiline
                            label="intiate case discription"
                            fullWidth
                            disabled
                            variant="filled"
                            value={caseData.description}
                          />
                        </>
                      )}
                      <div>
                        {/* Your existing code */}
                        {expandedCases[caseData.case_id] && (
                          <div>
                            {/* Other content */}
                            {caseData.judge_decision && ( // Check if judge_decision is not null
                              <div
                                style={{
                                  padding: "10px",
                                  backgroundColor: `${colors.primary[600]}`,
                                  color: `${colors.primary[100]}`,
                                  borderRadius: "10px",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: caseData.judge_decision,
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => toggleCaseDetails(caseData.case_id)}
                      >
                        {expandedCases[caseData.case_id]
                          ? "Hide Details"
                          : "Case Details"}
                      </Button>
                    </Box>
                  ))}
                </>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: `${colors.blueAccent[900]}`, // Set your preferred background color
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this Case"}
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="success"
            variant="outlined"
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

export default AddCase;
