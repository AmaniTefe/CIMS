import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import Calendar from "../calendar/calendar";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import axios from "axios";
import {
  GavelOutlined,
  GavelRounded,
  GavelSharp,
  PeopleOutline,
} from "@mui/icons-material";
import GeographyChart from "../../components/GeographyChart";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { FaUsers } from "react-icons/fa";
import BackupIcon from "@mui/icons-material/Backup";
const CourtManagerDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null); // State to store fetched data
  const [userData, setUserData] = useState([]);
  const [criminalJudges, setCriminalJudges] = useState([]);
  const [civilJudges, setCivilJudges] = useState([]);
  const [fetchedCases, setFetchedCases] = useState([]);
  const [userCounts, setUserCounts] = useState({
    all: 0,
    judge: 0,
    invoice_clerk: 0,
    proscuter: 0,
    registrar: 0,
    inactive: 0,
  });
  const allPercentage = 100;

  const totalCount = fetchedCases.length;
  const closedCount = fetchedCases.filter(
    (caseData) => caseData.case_status === "closed"
  ).length;
  const runningCount = fetchedCases.filter(
    (caseData) => caseData.case_status === "running"
  ).length;
  const CivilCase = fetchedCases.filter(
    (caseData) => caseData.case_type === "civil"
  ).length;
  const CriminalCase = fetchedCases.filter(
    (caseData) => caseData.case_type === "criminal"
  ).length;
  const notAssignedCount = fetchedCases.filter(
    (caseData) => caseData.first_name === null
  ).length;
  const AssignedCount = fetchedCases.filter(
    (caseData) => caseData.first_name !== null
  ).length;
  const civilcasePercentage = ((CivilCase / totalCount) * 100).toFixed(2);
  const criminalcasePercentage = ((CriminalCase / totalCount) * 100).toFixed(2);

  const closedPercentage = ((closedCount / totalCount) * 100).toFixed(2);
  const runningPercentage = ((runningCount / totalCount) * 100).toFixed(2);
  const notAssignedPercentage = ((notAssignedCount / totalCount) * 100).toFixed(
    2
  );
  const AssignedPercentage = ((AssignedCount / totalCount) * 100).toFixed(2);
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
  useEffect(() => {
    fetchJudge();
    fetchCaseCount();
  }, []);

  const handleBackup = () => {
    axios
      .get("http://localhost:8081/api/backup", { responseType: "blob" })
      .then((response) => {
        // Create a blob from the response data
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = url;
        a.download = "backup.sql"; // Set the filename for download
        a.click();

        // Clean up resources
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error backing up database:", error);
      });
  };

  return (
    <Box padding="40px" backgroundColor={colors.blueAccent[900]}>
      {/* HEADER */}
      <Box
        sx={{ mb: "10px" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<BackupIcon />}
            onClick={handleBackup}
          >
            Back Up DataBase
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={totalCount}
            subtitle="Total cases"
            progress={allPercentage / 100}
            increase={`+${allPercentage}%`}
            icon={
              <GavelSharp
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={CriminalCase}
            subtitle="Criminal Cases"
            progress={criminalcasePercentage / 100}
            increase={`+${criminalcasePercentage}%`}
            icon={
              <GavelSharp
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={CivilCase}
            subtitle="Civil Cases"
            progress={civilcasePercentage / 100}
            increase={`+${civilcasePercentage}%`}
            icon={
              <GavelSharp
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={runningCount}
            subtitle=" Running Cases"
            progress={runningPercentage / 100}
            increase={`+${runningPercentage}%`}
            icon={
              <GavelRounded
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={closedCount}
            subtitle=" Closed Cases"
            progress={closedPercentage / 100}
            increase={`+${closedPercentage}%`}
            icon={
              <GavelOutlined
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={notAssignedCount}
            subtitle="Not Assigned case"
            progress={notAssignedPercentage / 100}
            increase={`+${notAssignedPercentage}%`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={AssignedCount}
            subtitle="Assigned judge cases"
            progress={AssignedPercentage / 100}
            increase={`+${AssignedPercentage}%`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          borderRadius="10px"
        >
          <Box>
            <Typography
              alignItems={"center"}
              variant="h4"
              fontWeight="600"
              color={colors.blueAccent[500]}
              padding={3}
            >
              Criminal Judges
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Judge
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              number of case
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              {" "}
              case id{" "}
            </Typography>
          </Box>
          {criminalJudges.map((judge, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {judge.first_name} {judge.last_name}
                </Typography>
                <Typography color={colors.grey[100]}>{judge.id}</Typography>
              </Box>
              <Typography color={colors.grey[100]}>
                {
                  fetchedCases.filter((caseData) => caseData.id === judge.id)
                    .length
                }
              </Typography>
              <Box>
                <Typography color={colors.grey[100]}>
                  {fetchedCases
                    .filter((caseData) => caseData.id === judge.id)
                    .map((caseData, idx, arr) =>
                      idx === arr.length - 1
                        ? `${caseData.case_id}`
                        : `${caseData.case_id}, `
                    )}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          borderRadius="10px"
        >
          <Box>
            <Typography
              alignItems={"center"}
              variant="h4"
              fontWeight="600"
              color={colors.blueAccent[500]}
              padding={3}
            >
              civil Judges
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Judge{" "}
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              number of case
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              {" "}
              Case Number{" "}
            </Typography>
          </Box>
          {civilJudges.map((judge, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {judge.first_name} {judge.last_name}
                </Typography>
                <Typography color={colors.grey[100]}>{judge.id}</Typography>
              </Box>
              <Typography color={colors.grey[100]}>
                {
                  fetchedCases.filter((caseData) => caseData.id === judge.id)
                    .length
                }
              </Typography>
              <Box>
                <Typography color={colors.grey[100]}>
                  {fetchedCases
                    .filter((caseData) => caseData.id === judge.id)
                    .map((caseData, idx, arr) =>
                      idx === arr.length - 1
                        ? `${caseData.case_id}`
                        : `${caseData.case_id}, `
                    )}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CourtManagerDashboard;
