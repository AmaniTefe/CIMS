import React, { useEffect, useState } from "react";
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
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
const initialValues = {};
const checkoutSchema = yup.object().shape({});
const AddCourtRegistrarCase = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [fetchedCases, setFetchedCases] = useState([]);
  const [expandedCases, setExpandedCases] = useState({});
  const [referencesVisible, setReferencesVisible] = useState({});
  const [enteredCaseId, setEnteredCaseId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [criminalJudges, setCriminalJudges] = useState([]);
  const [civilJudges, setCivilJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleClick = () => {
    navigate(`/registrar/caseform`);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    fetchCaseCount();
    fetchJudge();
    const intervalId = setInterval(fetchCaseCount, 3000);
    return () => clearInterval(intervalId);
  }, [submitSuccess]);

  const fetchJudge = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/judge");
      if (!response.ok) {
        throw new Error("Failed to fetch judge information");
      }
      const data = await response.json();
      console.log("Fetched judge information:", data);

      // Filter judges into criminal and civil categories
      const criminalJudgesData = data.filter(
        (judge) => judge.judge_type.toLowerCase() === "criminal"
      );
      console.log("Filtered Criminal Judges:", criminalJudgesData);

      const civilJudgesData = data.filter(
        (judge) => judge.judge_type.toLowerCase() === "civil"
      );
      console.log("Filtered Civil Judges:", civilJudgesData);

      setCriminalJudges(criminalJudgesData);
      setCivilJudges(civilJudgesData);
    } catch (error) {
      console.error("Error fetching judge information:", error);
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
      console.log("Fetched case count:", data);
      setFetchedCases(data);
    } catch (error) {
      console.error("Error fetching case count:", error);
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
  const handleSubmitc = async (selectedCaseId) => {
    // Make sure selectedJudge and selectedCaseId have values before submitting
    if (selectedJudge && selectedCaseId) {
      try {
        // Log the selected judge's value
        console.log("Selected Judge:", selectedJudge);

        // Log the selected case ID
        console.log("Selected Case ID:", selectedCaseId);

        // Prepare the POST data with only the selected judge's ID
        const postData = {
          selectedJudgeId: selectedJudge, // Change to selectedJudgeId
          selectedCaseId: selectedCaseId,
        };

        // Perform the API POST request with the selected judge's ID
        const response = await fetch("http://localhost:8081/api/judgeassign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        setSubmitSuccess(true);
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to submit data");
        }

        // Handle success response
        const data = await response.json();
        console.log("Submitted data:", data);

        // Optionally, reset the selectedJudge state after submission
        setSelectedJudge("");
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error submitting data:", error);
        // Handle error state if needed
      }
    } else {
      // Handle case where no judge or case is selected
      console.error("No judge or case selected");
    }
  };
  const handleSubmitcc = async (selectedCaseId) => {
    // Make sure selectedJudge and selectedCaseId have values before submitting
    if (selectedJudge && selectedCaseId) {
      try {
        // Log the selected judge's value
        console.log("Selected Judge:", selectedJudge);

        // Log the selected case ID
        console.log("Selected Case ID:", selectedCaseId);

        // Prepare the POST data with only the selected judge's ID
        const postData = {
          selectedJudgeId: selectedJudge,
          selectedCaseId: selectedCaseId,
        };

        // Perform the API POST request with the selected judge's ID
        const response = await fetch("http://localhost:8081/api/judgeassign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        setSubmitSuccess(true);
        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to submit data");
        }

        // Handle success response
        const data = await response.json();
        console.log("Submitted data:", data);

        // Optionally, reset the selectedJudge state after submission
        setSelectedJudge("");
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error submitting data:", error);
        // Handle error state if needed
      }
    } else {
      // Handle case where no judge or case is selected
      console.error("No judge or case selected");
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
            <Box
              sx={{ mt: "10px" }}
              padding="5px"
              backgroundColor={colors.blueAccent[900]}
            >
              <Box m="40px 0 0 0">
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
                            <Typography
                              variant="h4"
                              margin={1}
                              color={colors.grey[100]}
                              style={{ fontWeight: "bold", fontSize: "1.1em" }}
                            >
                              Payment Status:{" "}
                              <span
                                style={{
                                  color: colors.greenAccent[300],
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}
                              >
                                {caseData.is_paid}
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

                            {caseData.first_name !== null &&
                              caseData.case_status === "running" && (
                                // Render select dropdown to choose a judge
                                <>
                                  <TextField
                                    select
                                    label="Transfer Case"
                                    value={selectedJudge}
                                    onChange={(e) =>
                                      setSelectedJudge(e.target.value)
                                    }
                                    variant="outlined"
                                    fullWidth
                                    style={{ marginTop: "10px" }}
                                  >
                                    {caseData.case_type === "criminal"
                                      ? criminalJudges.map((judge) => (
                                          <MenuItem
                                            key={judge.id}
                                            value={judge.id}
                                          >
                                            {`${judge.id}  ${judge.first_name} ${judge.last_name}`}
                                          </MenuItem>
                                        ))
                                      : civilJudges.map((judge) => (
                                          <MenuItem
                                            key={judge.id}
                                            value={judge.id}
                                          >
                                            {`${judge.id}  ${judge.first_name} ${judge.last_name}`}
                                          </MenuItem>
                                        ))}
                                  </TextField>

                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      handleSubmitcc(caseData.case_id)
                                    }
                                    style={{ marginTop: "10px" }}
                                  >
                                    Submit
                                  </Button>
                                </>
                              )}

                            {caseData.is_paid === "Paid" && (
                              <>
                                {caseData.first_name === null ? (
                                  // Render select dropdown to choose a judge
                                  <>
                                    <TextField
                                      select
                                      label="Judge Type"
                                      value={selectedJudge}
                                      onChange={(e) =>
                                        setSelectedJudge(e.target.value)
                                      }
                                      variant="outlined"
                                      fullWidth
                                      style={{ marginTop: "10px" }}
                                    >
                                      {caseData.case_type === "criminal"
                                        ? criminalJudges.map((judge) => (
                                            <MenuItem
                                              key={judge.id}
                                              value={judge.id}
                                            >
                                              {`${judge.id}  ${judge.first_name} ${judge.last_name}`}
                                            </MenuItem>
                                          ))
                                        : civilJudges.map((judge) => (
                                            <MenuItem
                                              key={judge.id}
                                              value={judge.id}
                                            >
                                              {`${judge.id}  ${judge.first_name} ${judge.last_name}`}
                                            </MenuItem>
                                          ))}
                                    </TextField>

                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() =>
                                        handleSubmitc(caseData.case_id)
                                      }
                                      style={{ marginTop: "10px" }}
                                    >
                                      Submit
                                    </Button>
                                  </>
                                ) : (
                                  // Render assigned judge's name
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
                                    >{` ${caseData.id} / ${caseData.first_name}/ ${caseData.last_name}`}</span>
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
                        <>
                          <TextField
                            style={{ margin: "10px" }}
                            multiline
                            label="discrioption"
                            fullWidth
                            disabled
                            variant="outlined"
                            value={caseData.description}
                          />
                        </>
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
          your operation is sucessfully done
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddCourtRegistrarCase;
