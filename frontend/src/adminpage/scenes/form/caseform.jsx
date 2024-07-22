import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Form, Formik } from "formik";
import Header from "../../components/Header";
import { tokens } from "../../../theme"; // Ensure this import is correct
import { useTheme } from "@mui/material";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// Define your initialValues and validation schema
const initialValues = {
  clientDetail: {
    selectedPetitioners: [],
    petitionerAdvocate: "",
    respondents: [],
    respondentAdvocate: "",
    documentFileName: "",
  },
  caseDetails: {
    caseType: "",
    caseSubType: "",
    description: "",
    policeStation: "",
    FIRNumber: "",
    FIRDate: "",
    registrationDate: "",
  },
};

const CaseForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [prosecutors, setProsecutors] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [clients, setClients] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [judges, setJudges] = useState([]);
  const [caseCount, setCaseCount] = useState(0);
  const [selectedPetitioners, setSelectedPetitioners] = useState([]);
  const [selectedRespondents, setSelectedRespondents] = useState([]);
  const [selectedAdvocateRespondents, setSelectedAdvocateRespondents] =
    useState([]);
  const [selectedAdvocatePetioner, setSelectedAdvocatePetioner] = useState([]);
  const [selectedProscutorPetioner, setSelectedProsctorPetioner] = useState([]);
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [selectedCaseSubType, setSelectedCaseSubType] = useState("");
  const [petitionerAdvocates, setPetitionerAdvocates] = useState([]);
  const [respondentAdvocates, setRespondentAdvocates] = useState([]);
  const [documentFileName, setDocumentFileName] = useState("");
  const [registrationDate, setRegistrationDate] = useState(""); // State for registration date
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [description, setDescription] = useState(null); // State for description
  const [policeStation, setPoliceStation] = useState(""); // State for police station
  const [FIRNumber, setFIRNumber] = useState(""); // State for FIR number
  const [FIRDate, setFIRDate] = useState(""); // State for FIR date
  const handleRegistrationDateChange = (event) => {
    setRegistrationDate(event.target.value); // Update registration date state
  };

  // Function to handle changes in description
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Update description state
  };

  // Function to handle changes in police station
  const handlePoliceStationChange = (event) => {
    setPoliceStation(event.target.value); // Update police station state
  };

  // Function to handle changes in FIR number
  const handleFIRNumberChange = (event) => {
    setFIRNumber(event.target.value); // Update FIR number state
  };

  // Function to handle changes in FIR date
  const handleFIRDateChange = (event) => {
    setFIRDate(event.target.value); // Update FIR date state
  };
  useEffect(() => {
    // Fetch advocates
    fetchAdvocates();
    // Fetch clients
    fetchCaseCount();
    fetchCaseTypes();
    fetchClients();
    fetchCaseSubTypes();
    fetchProsecutors();
  }, []);

  const fetchAdvocates = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/caseadvocators");
      if (!response.ok) {
        throw new Error("Failed to fetch advocates");
      }
      const data = await response.json();
      console.log("Fetched advocates:", data);

      // Flatten the nested array
      const flattenedAdvocates = data.flatMap((arr) => arr);
      // Filter out unwanted objects
      const filteredAdvocates = flattenedAdvocates.filter(
        (advocate) => advocate.middle_name && advocate.first_name
      );
      console.log("Filtered Advocates:", filteredAdvocates);

      // Set petitioner advocates and respondent advocates based on the case type
      setPetitionerAdvocates(filteredAdvocates);
      setRespondentAdvocates(filteredAdvocates);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    }
  };

  const fetchProsecutors = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/caseproscuter");
      if (!response.ok) {
        throw new Error("Failed to fetch prosecutors");
      }
      const data = await response.json();
      console.log("Fetched prosecutors:", data);

      // Flatten the nested array
      const flattenedProsecutors = data.flatMap((arr) => arr);

      // Filter out unwanted objects
      const filteredProsecutors = flattenedProsecutors.filter(
        (prosecutor) => prosecutor.id && prosecutor.first_name
      );

      console.log("Filtered Prosecutors:", filteredProsecutors);

      setProsecutors(filteredProsecutors);
    } catch (error) {
      console.error("Error fetching prosecutors:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/caseclients");
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await response.json();
      console.log("Fetched clients:", data); // Log the fetched data
      // Flatten the nested array
      const flattenedClients = data.flatMap((arr) => arr);
      // Filter out unwanted objects

      const filteredClients = flattenedClients.filter(
        (client) => client.id && client.first_name
      );
      console.log("Filtered Clients:", filteredClients);
      setClients(filteredClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  const fetchCaseTypes = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getCaseType");
      if (!response.ok) {
        throw new Error("Failed to fetch case types");
      }
      const data = await response.json();
      console.log("Fetched case types:", data); // Log the fetched case types
      // Set case types
      setCaseTypes(data);
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };
  const handleDocumentChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Extracting the file name
        const fileName = file.name;
        setDocumentFileName(fileName);
        // Extracting the case ID from the case count state
        const caseId = caseCount + 1;

        // Append the file name and case ID to the FormData object
        formData.append("fileName", fileName);
        formData.append("caseId", caseId);

        // Log case ID and file name
        console.log("Case ID:", caseId);
        console.log("File Name:", fileName);

        // Make a POST request to upload the file and associated data to the server
        const response = await fetch(
          "http://localhost:8081/api/uploaddocument",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();

        // Handle the response as needed
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  const fetchCaseCount = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getcasecout");
      if (!response.ok) {
        throw new Error("Failed to fetch case count");
      }
      const data = await response.json();
      console.log("Fetched case count:", data.count);
      setCaseCount(data.count);
    } catch (error) {
      console.error("Error fetching case count:", error);
    }
  };
  const fetchCaseSubTypes = async (caseType) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/getCaseSubType?caseType=${caseType}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch case sub types");
      }
      const data = await response.json();
      console.log("Fetched case sub types:", data); // Log the fetched case sub types
      // Set case sub types
      setCaseSubTypes(data);
    } catch (error) {
      console.error("Error fetching case sub types:", error);
    }
  };
  const resetForm = () => {
    setDynamicInitialValues(initialValues);
    setRegistrationDate("");
    setDescription("");
    setPoliceStation("");
    setFIRNumber("");
    setFIRDate("");
  };
  const handleFormSubmit = async (values) => {
    console.log("Form submitted!");

    try {
      console.log("the dynamic intial value is  ", dynamicInitialValues); // Log the form values before sending to the server

      // Perform form submission logic here, such as sending the form data to the server
      const response = await fetch("http://localhost:8081/api/addcase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dynamicInitialValues),
      });

      if (!response.ok) {
        throw new Error("Failed to save case");
      }

      // If the form submission is successful, you can show a success message or navigate to another page
      handleSnackbarOpen();
      resetForm();
      setSelectedPetitioners([]);
      setSelectedRespondents([]);
      setSelectedCaseType("");
      setSelectedCaseSubType("");
      console.log("Case saved successfully!");
    } catch (error) {
      console.error("Error saving case:", error);
      // Handle error, show error message, or perform any necessary actions
    }
  };
  const handleBackButtonClick = () => {
    navigate("/registrar/addcase");
  };
  const [dynamicInitialValues, setDynamicInitialValues] =
    useState(initialValues);

  useEffect(() => {
    // Update clientDetail in dynamicInitialValues
    setDynamicInitialValues((prevValues) => ({
      ...prevValues,
      clientDetail: {
        ...prevValues.clientDetail,
        selectedPetitioners: selectedPetitioners,
        respondents: selectedRespondents,
        respondentAdvocate: selectedAdvocateRespondents,
        documentFileName: documentFileName,
        // Include petitionerAdvocate if case type is civil, otherwise include petiionerProscutor
        ...(selectedCaseType === "civil"
          ? { petitionerAdvocate: selectedAdvocatePetioner }
          : { petiionerProscutor: selectedProscutorPetioner }),
      },
      caseDetails: {
        ...prevValues.caseDetails,
        caseType: selectedCaseType,
        caseSubType: selectedCaseSubType,
        registrationDate: registrationDate,
        description: description,
        policeStation: policeStation,
        FIRNumber: FIRNumber,
        FIRDate: FIRDate,
      },
    }));
  }, [
    selectedPetitioners,
    selectedRespondents,
    selectedAdvocateRespondents,
    selectedAdvocatePetioner,
    selectedCaseSubType,
    documentFileName,
    selectedProscutorPetioner,
    selectedCaseType,
    registrationDate,
    description,
    policeStation,
    FIRNumber,
    FIRDate,
  ]);

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="flex-end" mt="20px">
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleBackButtonClick}
          startIcon={<ArrowBackIosNewOutlinedIcon fontSize="small" />}
        >
          Back
        </Button>
      </Box>
      <Header title="Add Case" subtitle="" />
      <Formik onSubmit={handleFormSubmit} initialValues={dynamicInitialValues}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Box display="grid" gridRow="span 10" gap="2px" padding="20px">
              <Box
                sx={{ backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="15px"
                padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Case Detail
                </Typography>
                <Box sx={{ display: "flex", gap: "20px" }}>
                  <TextField
                    name="caseNumber"
                    label={`Case Number`} // Concatenate the text and case count
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={`Case Number: ${caseCount + 1}`} // Set the value
                    disabled // Make the field disabled
                  />

                  <TextField
                    id="caseType"
                    select
                    label="Case Type"
                    value={values.caseDetails.caseType}
                    onChange={(event) => {
                      const selectedCaseType = event.target.value;
                      setSelectedCaseType(selectedCaseType);
                      setFieldValue("caseDetails.caseType", selectedCaseType);
                      fetchCaseSubTypes(selectedCaseType);
                    }}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  >
                    {caseTypes.map((caseType) => (
                      <MenuItem
                        key={caseType.case_type}
                        value={caseType.case_type}
                      >
                        {caseType.case_type}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    id="caseSubType"
                    select
                    label="Case Sub Type"
                    value={values.caseDetails.caseSubType}
                    onChange={(event) => {
                      const selectedCaseSubType = event.target.value;
                      setSelectedCaseSubType(selectedCaseSubType);
                      // Update selected case sub
                      console.log("case sub type ", selectedCaseSubType);
                      setFieldValue(
                        "caseDetails.caseSubType",
                        event.target.value
                      );
                    }}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                  >
                    {caseSubTypes.map((subType) => (
                      <MenuItem
                        key={subType.sub_type_name}
                        value={subType.sub_type_name}
                      >
                        {subType.sub_type_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Typography variant="body1" sx={{ mt: "20px", ml: "10px" }}>
                    Registration Date:
                  </Typography>
                  <TextField
                    name="registrationDate"
                    type="date"
                    variant="outlined"
                    margin="normal"
                    required
                    value={registrationDate}
                    onChange={handleRegistrationDateChange}
                    sx={{ width: "30%" }}
                  />
                  <TextField
                    required
                    multiline
                    rows={4}
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={handleDescriptionChange}
                    onBlur={handleBlur} // Add onBlur event handler
                    sx={{ mt: 2, ml: "20px" }}
                  />
                </Box>
              </Box>
              <Box
                sx={{ mt: "30px", backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="20px"
                padding="30px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Client Detail
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">Select Petitioner*</Typography>
                    <TextField
                      id="petitioners"
                      select
                      required
                      value={selectedPetitioners}
                      onChange={(event) => {
                        const selectedPetitioner = event.target.value;
                        console.log("Selected Petitioner:", selectedPetitioner);
                        setSelectedPetitioners(selectedPetitioner);
                        // Remove the selected petitioner from respondents
                        setSelectedRespondents((prev) =>
                          prev.filter((client) => client !== selectedPetitioner)
                        );
                      }}
                      variant="outlined"
                      fullWidth
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 250,
                              backgroundColor: `${colors.blueAccent[900]}`,
                            },
                          },
                        },
                        multiple: true,
                        autoHighlight: true,
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Petitioner
                      </MenuItem>
                      {clients
                        .filter(
                          (client) => !selectedRespondents.includes(client.id)
                        )
                        .map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {`${client.first_name} ${client.middle_name} ${client.email}`}
                          </MenuItem>
                        ))}
                    </TextField>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {selectedCaseType === "criminal"
                        ? "Select proscuter for petioner*"
                        : "Select Advocator for petioner*"}
                    </Typography>
                    <TextField
                      id="petitionerAdvocate"
                      select
                      label={
                        selectedCaseType === "criminal"
                          ? "select proscuter for petioner*"
                          : "select Advocator for petioner*"
                      }
                      value={values.clientDetail.petitionerAdvocate}
                      onChange={(event) => {
                        const selectedProsecutor = event.target.value;
                        if (selectedCaseType === "criminal") {
                          console.log(
                            "Selected Prosecutor:",
                            selectedProsecutor.id
                          );
                          setSelectedProsctorPetioner(selectedProsecutor.id);
                        } else {
                          console.log(
                            "Selected Petitioner Advocate:",
                            selectedProsecutor.advocator_id
                          );
                          setSelectedAdvocatePetioner(
                            selectedProsecutor.advocator_id
                          );
                        }
                        setFieldValue(
                          "clientDetail.petitionerAdvocate",
                          selectedProsecutor
                        );
                        setRespondentAdvocates((prev) =>
                          prev.filter(
                            (advocate) =>
                              advocate.advocator_id !==
                              selectedProsecutor.advocator_id
                          )
                        );
                      }}
                      variant="outlined"
                      fullWidth
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 250,
                              backgroundColor: `${colors.blueAccent[900]}`,
                            },
                          },
                        },
                        autoHighlight: true,
                      }}
                    >
                      {/* Conditionally render options based on selected case type */}
                      {selectedCaseType === "criminal"
                        ? // Render prosecutors if case type is Criminal
                          prosecutors.map((prosecutor) => (
                            <MenuItem
                              key={prosecutor.advocator_id}
                              value={prosecutor}
                            >
                              {`${prosecutor.first_name} ${prosecutor.last_name} ${prosecutor.email}`}
                            </MenuItem>
                          ))
                        : // Render advocates for civil cases
                          petitionerAdvocates.map((advocate) => (
                            <MenuItem
                              key={advocate.advocator_id}
                              value={advocate}
                            >
                              {`${advocate.first_name} ${advocate.middle_name} ${advocate.last_name}`}
                            </MenuItem>
                          ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6">Select Respondent*</Typography>
                    <TextField
                      id="respondents"
                      select
                      value={selectedRespondents}
                      required
                      onChange={(event) => {
                        const selectedRespondent = event.target.value;
                        console.log("Selected Respondent:", selectedRespondent); // Log selected respondent
                        setSelectedRespondents(selectedRespondent);
                        setSelectedPetitioners((prev) =>
                          prev.filter((client) => client !== selectedRespondent)
                        );
                      }}
                      variant="outlined"
                      fullWidth
                      SelectProps={{
                        renderValue: (selected) =>
                          selected
                            .map((id) => {
                              const selectedClient = clients.find(
                                (client) => client.id === id
                              );
                              return `${selectedClient.first_name} ${selectedClient.last_name}`;
                            })
                            .join(", "),
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 250,
                              backgroundColor: `${colors.blueAccent[900]}`,
                            },
                          },
                        },
                        multiple: true,
                        autoHighlight: true,
                      }}
                    >
                      {clients
                        .filter(
                          (client) => !selectedPetitioners.includes(client.id)
                        )
                        .map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {`${client.first_name} ${client.middle_name} ${client.email}`}
                          </MenuItem>
                        ))}
                    </TextField>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Select Advocate for Respondent*
                    </Typography>
                    <TextField
                      id="respondentAdvocate"
                      required
                      select
                      value={values.clientDetail.respondentAdvocate}
                      onChange={(event) => {
                        const selectedAdvocate = event.target.value;
                        setSelectedAdvocateRespondents(
                          selectedAdvocate.advocator_id
                        );
                        console.log(
                          "Selected Respondent Advocate:",
                          selectedAdvocate.advocator_id
                        ); // Log selected respondent advocate
                        setFieldValue(
                          "clientDetail.respondentAdvocate",
                          selectedAdvocate
                        );
                        setPetitionerAdvocates((prev) =>
                          prev.filter(
                            (advocate) =>
                              advocate.advocator_id !==
                              selectedAdvocate.advocator_id
                          )
                        );
                      }}
                      variant="outlined"
                      fullWidth
                      autoHighlight
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              width: 250,
                              backgroundColor: `${colors.blueAccent[900]}`,
                            },
                          },
                        },
                      }}
                    >
                      {respondentAdvocates.map((advocate) => (
                        <MenuItem key={advocate.advocator_id} value={advocate}>
                          {`${advocate.first_name} ${advocate.middle_name} ${advocate.last_name}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

              {/* Conditionally render the Box component */}
              {selectedCaseType === "criminal" && (
                <Box
                  sx={{
                    mt: "30px",
                    backgroundColor: `${colors.primary[400]}75`,
                    borderRadius: "15px",
                    padding: "30px",
                  }}
                >
                  <Typography color={colors.greenAccent[500]} variant="h3">
                    FIR Detail
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <TextField
                      name="policeStation"
                      label="Police Station"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      value={policeStation}
                      onChange={handlePoliceStationChange}
                    />
                    <TextField
                      name="FIRNumber"
                      label="FIR Number"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      required
                      sx={{ ml: "20px" }}
                      value={FIRNumber}
                      onChange={handleFIRNumberChange}
                    />
                    <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
                      FIR Date:
                    </Typography>
                    <TextField
                      name="FIRDate"
                      type="date"
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ ml: "20px", width: "50%" }}
                      value={FIRDate}
                      onChange={handleFIRDateChange}
                    />
                  </Box>
                </Box>
              )}

              <Box
                sx={{ mt: "30px", backgroundColor: `${colors.primary[400]}75` }}
                borderRadius="15px"
                padding="15px"
              >
                <Typography color={colors.greenAccent[500]} variant="h3">
                  Add Document
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Grid container alignItems="flex">
                    <label htmlFor="file-upload">
                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleDocumentChange} // Attach handleDocumentChange function here
                      />
                      <Button
                        component="span"
                        variant="contained"
                        color="secondary"
                        size="medium"
                        sx={{ mt: "10px", ml: "40px" }}
                      >
                        <DescriptionOutlinedIcon /> Add Document
                      </Button>
                    </label>
                  </Grid>
                </Box>
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
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ mt: "10px", ml: "10px" }}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert elevation={6} s onClose={handleSnackbarClose} severity="success">
          Case added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CaseForm;
