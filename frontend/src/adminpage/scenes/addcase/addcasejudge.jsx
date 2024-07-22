import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import MuiAlert from "@mui/material/Alert";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer"; // Import necessary modules
import { Form, Formik } from "formik";
import * as yup from "yup";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Snackbar } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Header from "../../components/Header";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./cked.css";
const initialValues = {};

const checkoutSchema = yup.object().shape({});

const AddCaseJudge = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedCases, setFetchedCases] = useState([]);
  const [filePath, setFilePath] = useState("");
  const [expandedCases, setExpandedCases] = useState({});
  const [referencesVisible, setReferencesVisible] = useState({});
  const [enteredCaseId, setEnteredCaseId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [decisionText, setDecisionText] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [showPDF, setShowPDF] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  // Function to toggle showing the PDF
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

  // PDF component to render the judge decision
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
  const handleMakeDecisionClick = (caseId) => {
    setShowDecisionForm(true);
    setSelectedCaseId(caseId); // Assuming setSelectedCaseId is a state setter function
  };

  const handleCancelClick = () => {
    setShowDecisionForm(false);
    // Reset the decision text when cancel is clicked
    setDecisionText("");
  };
  const handleSubmited = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Decision submitted:", decisionText);
    console.log("case id ", selectedCaseId);
    // Make sure there's a case ID available
    if (!selectedCaseId) {
      console.error("Case ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/api/editcasedecition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caseId: selectedCaseId,
            decisionText: decisionText,
          }),
        }
      );

      if (response.ok) {
        console.log("Decision submitted successfully.");
        // Reset the decision text after submission
        setDecisionText("");
        setShowDecisionForm(false);
        fetchCaseCount();
      } else {
        console.error("Failed to submit decision:", response.statusText);
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting decision:", error);
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setDecisionText(data);
  };
  useEffect(() => {
    fetchCaseCount();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchCaseCount = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        const judgeId = decodedToken.userId;
        console.log("Sending judge ID to backend:", judgeId); // Log the judge ID before sending to the backend

        const response = await fetch(
          `http://localhost:8081/api/fetchcasebyjudge`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ assignedJudgeId: judgeId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cases");
        }

        const data = await response.json();
        console.log("Fetched cases:", data);
        setFetchedCases(data);
      } else {
        console.warn("Access token not found in local storage");
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

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
  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Header title="Case Management" subtitle="" />

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
                  // Ensure only numbers are entered
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
            {/* DataGrid */}
            <Box
              sx={{ mt: "10px" }}
              padding="5px"
              backgroundColor={colors.blueAccent[900]}
            >
              <Box m="40px 0 0 0">
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={6000} // Adjust as needed
                  onClose={handleSnackbarClose}
                  message="Case deleted successfully"
                />

                {/* Render CaseBoxes for each fetched case */}
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
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"space-between"}
                        p={2}
                      >
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
                                    Initiate Case Document
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
                      <Box></Box>

                      {expandedCases[caseData.case_id] && (
                        <Grid container m={0.1} boxShadow={10} padding={1}>
                          <Grid item xs={10}>
                            <Typography
                              variant="h3"
                              color="#5bc0de"
                              style={{ fontWeight: "bold" }}
                            >
                              Case Documents
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
                      {caseData.case_status === "running" && (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              handleMakeDecisionClick(caseData.case_id)
                            }
                          >
                            Make Decision
                          </Button>
                        </Box>
                      )}
                      {showDecisionForm &&
                        selectedCaseId === caseData.case_id && (
                          <form onSubmit={handleSubmited}>
                            <Box
                              sx={{
                                "& .ck-editor__main .ck-content": {
                                  background: `${colors.grey[400]}`,
                                  marginTop: "2px",
                                  boxShadow: "10px",
                                  borderRadius: "5px",
                                  height: "190px",
                                },
                              }}
                            >
                              <CKEditor
                                editor={ClassicEditor}
                                data={decisionText}
                                onChange={handleEditorChange}
                                config={{
                                  toolbar: [
                                    "heading",
                                    "|",
                                    "bold",
                                    "italic",
                                    "underline",
                                    "|",
                                    "bulletedList",
                                    "numberedList",
                                    "|",
                                    "link",
                                    "|",
                                    "undo",
                                    "redo",
                                  ],
                                }}
                              />
                            </Box>

                            <Box
                              mt={2}
                              display="flex"
                              justifyContent="flex-end"
                              gap="5px"
                            >
                              <Button
                                variant="contained"
                                onClick={handleSubmited}
                                type="submit"
                                color="secondary"
                              >
                                Submit
                              </Button>
                              <Button
                                variant="contained"
                                onClick={handleCancelClick}
                                color="error"
                              >
                                Cancel
                              </Button>
                            </Box>
                          </form>
                        )}
                      {expandedCases[caseData.case_id] && (
                        <>
                          <TextField
                            style={{
                              margin: "10px",
                              fontSize: "40px",
                              backgroundColor: `${colors.primary[600]}`,
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
                            <button onClick={() => setShowPDF(true)}>
                              Download PDF
                            </button>
                            {showPDF && (
                              <PDFDownloadLink
                                document={
                                  <PDFComponent
                                    judgeDecision={caseData.judge_decision}
                                  />
                                }
                                fileName="judge_decision.pdf"
                              >
                                {({ blob, url, loading, error }) =>
                                  loading
                                    ? "Loading document..."
                                    : "Download now!"
                                }
                              </PDFDownloadLink>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="contained"
                        onClick={() => toggleCaseDetails(caseData.case_id)}
                        color="secondary"
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Decision Submitted Successfully
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddCaseJudge;
