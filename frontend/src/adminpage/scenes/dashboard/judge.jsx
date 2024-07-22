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
import {
  GavelOutlined,
  GavelRounded,
  GavelSharp,
  PeopleOutline,
} from "@mui/icons-material";
import GeographyChart from "../../components/GeographyChart";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { FaUsers } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const JudgeDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null); // State to store fetched data
  const [userData, setUserData] = useState([]);

  const [fetchedCases, setFetchedCases] = useState([]);
  const [cases, setCases] = useState([]);
  const totalCount = fetchedCases.length;
  const closedCount = fetchedCases.filter(
    (caseData) => caseData.case_status === "closed"
  ).length;
  const runningCount = fetchedCases.filter(
    (caseData) => caseData.case_status === "running"
  ).length;

  const closedPercentage = ((closedCount / totalCount) * 100).toFixed(2);
  const runningPercentage = ((runningCount / totalCount) * 100).toFixed(2);

  const fetchCaseCounts = async () => {
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
  const fetchAppointment = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const judgeId = decodedToken.userId; // Get the userId from the decoded JWT token

      const response = await fetch("http://localhost:8081/api/getappointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ judgeId }), // Send the judgeId to the backend server
      });

      const data = await response.json();
      console.log("data", data);
      setCases(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  useEffect(() => {
    fetchCaseCounts();
    fetchAppointment();
  }, []);
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
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={totalCount}
            subtitle="total cases"
            progress={100 / 100}
            increase={`+${100}%`}
            icon={
              <GavelSharp
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
        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          sx={{ marginBottom: "30px" }}
        >
          <Calendar />
        </Box>
      </Box>
    </Box>
  );
};

export default JudgeDashboard;
