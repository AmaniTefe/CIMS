import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useTheme } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import Header from "../../components/Header";
import { tokens } from "../../../theme";

const ProscutorCases = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Assuming you have data for documents
  const [documents, setDocuments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [docIdToUpdate, setDocIdToUpdate] = useState(null);
  const [newStatusToUpdate, setNewStatusToUpdate] = useState(null);
  const [prosecutorId, setProsecutorID] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // useEffect to fetch documents
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Function to fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/proscutorcasedocuments" // Update the route here
      );
      const data = await response.json();
      setDocuments(data);
      setProsecutorID(data[0].prosecutor_id);
      console.log(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleToggleSwitch = (docId, newStatus) => {
    setDocIdToUpdate(docId);
    setNewStatusToUpdate(newStatus);
    setDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    setDialogOpen(false);
    handleSwitchToggle(docIdToUpdate, newStatusToUpdate);
  };

  const handleCancelToggle = () => {
    setDialogOpen(false);
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  // Function to handle switch toggle
  const handleSwitchToggle = async (docId, newStatus) => {
    try {
      // Log the data being sent in the API request
      console.log("Sending data:", { docId, status: newStatus });

      // Make the API call to update the status
      const response = await fetch(
        "http://localhost:8081/api/updateDocumentStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ docId, prosecutorId, status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update document status");
      }

      // Update the status locally for immediate effect
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === docId ? { ...doc, status: newStatus } : doc
        )
      );

      console.log(
        "Toggle switch for document:",
        docId,
        "New status:",
        newStatus
      );
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating document status:", error);
    }
  };

  return (
    <Box
      padding="20px"
      paddingBottom={30}
      backgroundColor={colors.blueAccent[900]}
    >
      <Header title="Cases " subtitle="initiated by prosecutor " />

      {/* Display documents as cards */}
      <Grid container spacing={3}>
        {documents.map((doc, result) => (
          <Grid item xs={12} sm={12} lg={6} xl={6} key={doc.id}>
            <Card
              sx={{
                padding: 0,
                boxShadow: "40",
              }}
            >
              <CardContent
                sx={{
                  backgroundColor: colors.primary[400],
                  margin: 0,
                  padding: 0,
                }}
              >
                <Grid
                  container
                  padding={2}
                  spacing={3}
                  sx={{ backgroundColor: colors.primary[400] }}
                >
                  {/* Document Description and Prosecutor Information columns */}
                  <Grid item xs={6}>
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
                      <span style={{ color: colors.greenAccent[300] }}>
                        {doc.description}
                      </span>
                    </Typography>
                    <Typography
                      variant="body1"
                      color={colors.grey[100]}
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.1em",
                        marginBottom: "0.5em",
                      }}
                    >
                      Prosecutor :
                      {`${doc.first_name} ${" "} ${doc.last_name} / ${
                        doc.id
                      } / ${prosecutorId}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {/* Display the document icon with a link to download the file */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body1"
                        color={colors.grey[100]}
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1em",
                          marginBottom: "0.5em",
                        }}
                      >
                        Status: {doc.status}
                      </Typography>
                      <Switch
                        checked={doc.status === "approved"}
                        onChange={(e) =>
                          handleToggleSwitch(
                            doc.id,
                            e.target.checked ? "approved" : "pending"
                          )
                        }
                        disabled={doc.status === "approved"} // Disable switch if status is "approved"
                        sx={{
                          "& .MuiSwitch-thumb": {
                            color:
                              doc.status === "approved"
                                ? colors.blueAccent[500]
                                : colors.blueAccent[100],
                          },
                          "& .MuiSwitch-track": {
                            backgroundColor:
                              doc.status === "approved"
                                ? colors.blueAccent[900]
                                : colors.blueAccent[100],
                          },
                        }}
                      />
                    </div>

                    <a href={`http://localhost:8081/${doc.file_path}`} download>
                      <Button component="span" variant="contained" size="large">
                        <DescriptionOutlinedIcon style={{ fontSize: "30px" }} />
                        {doc.file_path}
                      </Button>
                    </a>
                    {/* Display switch with status */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCancelToggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ backgroundColor: colors.blueAccent[900] }}
          id="alert-dialog-title"
        >
          {"Confirmation"}
        </DialogTitle>
        <DialogContent style={{ backgroundColor: colors.blueAccent[900] }}>
          <DialogContentText
            style={{ backgroundColor: colors.blueAccent[900] }}
            id="alert-dialog-description"
          >
            Are you sure you want to change the status?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ backgroundColor: colors.blueAccent[900] }}>
          <Button variant="outlined" color="error" onClick={handleCancelToggle}>
            No
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleConfirmToggle}
            autoFocus
          >
            Yes
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
          Status Changed Successfully
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ProscutorCases;
