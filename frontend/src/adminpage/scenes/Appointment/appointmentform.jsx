import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  colors,
  useTheme,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios"; // Import Axios for making HTTP requests
import { tokens } from "../../../theme";
import { jwtDecode } from "jwt-decode";
import Snackbar from "@mui/material/Snackbar";

const Appointmentform = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [petitioners, setPetitioners] = useState([]);
  const [respondents, setRespondents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchCases = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      const response = await fetch(
        "http://localhost:8081/api/appointmentcases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ judgeId: userId }), // Include the userId as judgeId in the request body
        }
      );

      const data = await response.json();
      console.log("Data received from backend:", data); // Add this line to check the structure of the data
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const openSnackbarWithMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // Function to fetch petitioners and respondents for the selected case
  const fetchPetitionersAndRespondents = async (caseId) => {
    try {
      console.log("Selected Case ID:", caseId); // Log the selected case ID before making requests
      const petitionersResponse = await axios.get(
        `http://localhost:8081/api/petitioners/${caseId}`
      );
      const respondentsResponse = await axios.get(
        `http://localhost:8081/api/respondents/${caseId}`
      );

      setPetitioners(petitionersResponse.data);
      console.log(petitionersResponse.data);
      setRespondents(respondentsResponse.data);
    } catch (error) {
      console.error("Error fetching case details:", error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleBackButtonClick = () => {
    navigate("/judge/appointment");
  };

  const handleCaseChange = (event, newValue) => {
    setSelectedCase(newValue);
    if (newValue) {
      console.log("Selected Case ID:", newValue.case_id); // Log the selected case ID
      fetchPetitionersAndRespondents(newValue.case_id);
    } else {
      setPetitioners([]);
      setRespondents([]);
    }
  };
  const handleSaveAppointment = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.userId;
      console.log("user id ", userId);

      // Check if any required fields are empty
      if (!selectedCase || !date || !time || !note) {
        openSnackbarWithMessage("One or more required fields are empty");
        return;
      }

      // Extract phone numbers from the fetched petitioner and respondent data
      const petitionerPhoneNumbers = petitioners
        .map((petitioner) => petitioner.petitioner_mobile_number)
        .join(", ");
      const respondentPhoneNumbers = respondents
        .map((respondent) => respondent.respondent_mobile_number)
        .join(", ");
      const advocatorPhoneNumber = respondents
        .map((respondent) => respondent.advocate_mobile_number)
        .join(", ");

      const appointmentData = {
        user_id: userId,
        case_id: selectedCase.case_id,
        petitioner_phone_numbers: petitionerPhoneNumbers,
        respondent_phone_numbers: respondentPhoneNumbers,
        advocate_phone_number: advocatorPhoneNumber,
        date: date,
        time: time,
        note: note,
      };
      console.log("Data to be sent to the server:", appointmentData);
      const response = await axios.post(
        "http://localhost:8081/api/addappointments",
        appointmentData
      );
      console.log("Appointment saved successfully:", response.data);
      // Optionally, you can navigate to another page or show a success message here
      setOpenSnackbar(true);
      setSnackbarMessage("Appointment Saved Successfully");

      // Reset all the values after successful save
      setSelectedCase(null);
      setDate("");
      setTime("");
      setNote("");
      setPetitioners([]);
      setRespondents([]);
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  };

  return (
    <Box padding="20px" mb="10px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="end" mt="10px">
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
      <Header title="Add Appointment" subtitle="Appointment Form" />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          severity="success"
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Box
        margin="20px"
        padding="30px"
        borderRadius="15px"
        bgcolor="primary.400"
      >
        <Box>
          <Autocomplete
            value={selectedCase}
            onChange={handleCaseChange}
            options={cases}
            getOptionLabel={(option) => option.case_id.toString()}
            renderInput={(params) => (
              <TextField {...params} label="Select Case" variant="outlined" />
            )}
            openOnFocus
            autoHighlight
            fullWidth
            sx={{ mt: "10px" }}
          />
        </Box>
        {selectedCase && (
          <Box>
            <Typography variant="h6" sx={{ mt: "20px" }}>
              Petitioners:
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ mt: "10px", bgcolor: colors.blueAccent[900] }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Email</TableCell>
                    {petitioners.some(
                      (petitioner) => petitioner.advocate_email !== null
                    ) && (
                      <>
                        <TableCell>Advocate Name</TableCell>
                        <TableCell>Advocate Phone Number</TableCell>
                        <TableCell>Advocate Email</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {petitioners.map((petitioner, index) => (
                    <TableRow key={index}>
                      <TableCell>{petitioner.petitioner_first_name}</TableCell>
                      <TableCell>
                        {petitioner.petitioner_mobile_number}
                      </TableCell>
                      <TableCell>{petitioner.petitioner_email}</TableCell>
                      {petitioner.advocate_email !== null && (
                        <>
                          <TableCell>
                            {petitioner.advocate_first_name}
                          </TableCell>
                          <TableCell>
                            {petitioner.advocate_mobile_number}
                          </TableCell>
                          <TableCell>{petitioner.advocate_email}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="h6" sx={{ mt: "20px" }}>
              Respondents:
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ mt: "10px", bgcolor: colors.blueAccent[900] }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Email</TableCell>
                    {respondents.some(
                      (respondent) => respondent.advocate_email !== null
                    ) && (
                      <>
                        <TableCell>Advocate Name</TableCell>
                        <TableCell>Advocate Phone Number</TableCell>
                        <TableCell>Advocate Email</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {respondents.map((respondent, index) => (
                    <TableRow key={index}>
                      <TableCell>{respondent.respondent_first_name}</TableCell>
                      <TableCell>
                        {respondent.respondent_mobile_number}
                      </TableCell>
                      <TableCell>{respondent.respondent_email}</TableCell>
                      {respondent.advocate_email !== null && (
                        <>
                          <TableCell>
                            {respondent.advocate_first_name}
                          </TableCell>
                          <TableCell>
                            {respondent.advocate_mobile_number}
                          </TableCell>
                          <TableCell>{respondent.advocate_email}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Box display="flex" gap="20px" mt="10px">
          <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
            Date:
          </Typography>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
            InputProps={{
              inputProps: {
                min: new Date().toISOString().split("T")[0], // Set min date to today
              },
            }}
          />
          <Typography variant="body1" sx={{ mt: "20px", ml: "20px" }}>
            Time:
          </Typography>
          <TextField
            type="time"
            variant="outlined"
            fullWidth
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Box>
        <Box mt="10px">
          <TextField
            multiline
            required
            rows={4}
            fullWidth
            id="Note"
            name="Note"
            label="Note"
            variant="outlined"
            sx={{ mt: "20px" }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            mt: "30px",
            display: "flex",
            justifyContent: "flex-end",
            mb: "50px",
          }}
          gap={2}
        >
          <Button
            type="button"
            variant="contained"
            color="error"
            sx={{ mt: "10px" }}
            onClick={handleBackButtonClick}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            sx={{ mt: "10px" }}
            onClick={handleSaveAppointment}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Appointmentform;
