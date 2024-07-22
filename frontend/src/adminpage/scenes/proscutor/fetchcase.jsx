import React, { useEffect, useState, useRef } from "react";
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
  DialogContentText,
  DialogTitle,
} from "@mui/material";
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
import EditCase from "../form/editcaseform";
import { jwtDecode } from "jwt-decode";
const initialValues = {};

const checkoutSchema = yup.object().shape({});

const FetchProscuterCases = () => {
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
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [openCaseFormDialog, setOpenCaseFormDialog] = useState(false);
  const [isEditFormClosed, setIsEditFormClosed] = useState(false);
  const [documentRows, setDocumentRows] = useState([]); // State variable to store document rows
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const handleClick = () => {
    navigate(`/registrar/caseform`);
  };
  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };
  const [documentDescriptions, setDocumentDescriptions] = useState({}); // State variable to store document descriptions
  const [documentFiles, setDocumentFiles] = useState({}); // State variable to store document files

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // Define a function to fetch case count
    const fetchCaseCount = async () => {
      try {
        // Decode the access token to get the prosecutor ID
        const accessToken = localStorage.getItem("accessToken");
        const decodedToken = jwtDecode(accessToken);
        const prosecutorId = decodedToken.userId;

        // Prepare the request body
        const requestBody = {
          prosecutorId: prosecutorId,
        };

        const response = await fetch(
          "http://localhost:8081/api/fetchcasebyproscutor",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
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

    // Call fetchCaseCount when the component mounts, and when the dialog is closed or when the edit form is submitted
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
            <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
              {/* Other code remains the same */}
              <Dialog
                open={openCaseFormDialog}
                onClose={() => setOpenCaseFormDialog(false)}
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
                  {/* Render the CaseForm component */}
                  {isEditFormOpen && <EditCase caseId={selectedCaseId} />}
                </DialogContent>
                <DialogActions
                  style={{ backgroundColor: `${colors.blueAccent[900]}` }}
                >
                  <Button
                    onClick={() => setOpenCaseFormDialog(false)}
                    color="info"
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
                              Case Information
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
                      <Button
                        variant="contained"
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
    </Box>
  );
};

export default FetchProscuterCases;
