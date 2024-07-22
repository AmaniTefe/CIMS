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
const ProscutorDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null); // State to store fetched data
  const [datas, setDatas] = useState(null); // State to store fetched data

  const [allintieatedcase, setAllintieatedcase] = useState(null);
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
  const judgePercentage = ((userCounts.judge / userCounts.all) * 100).toFixed(
    2
  );
  const invoiceClerkPercentage = (
    (fetchedCases.tota / fetchedCases.totalCount) *
    100
  ).toFixed(2);
  const proscutorPercentage = (
    (fetchedCases.proscuter / fetchedCases.totalCount) *
    100
  ).toFixed(2);
  const registrarPercentage = (
    (fetchedCases.registrar / fetchedCases.totalCount) *
    100
  ).toFixed(2);
  const inactivePercentage = (
    (fetchedCases.inactive / fetchedCases.totalCount) *
    100
  ).toFixed(2);

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

  const closedPercentage = ((closedCount / totalCount) * 100).toFixed(2);
  const runningPercentage = ((runningCount / totalCount) * 100).toFixed(2);
  const notAssignedPercentage = ((notAssignedCount / totalCount) * 100).toFixed(
    2
  );
  const AssignedPercentage = ((AssignedCount / totalCount) * 100).toFixed(2);
  const approvedintieatedcasepersentage = (
    (datas / allintieatedcase) *
    100
  ).toFixed(2);
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

      const cases = await response.json();
      console.log("Fetched case count:", cases);

      // Fetch judges
      await fetchJudge();

      // Iterate over cases to find corresponding judge
      const casesWithJudges = cases.map((caseData) => {
        const judge = cases.find((judge) => judge.id === caseData.id);
        const judgeName = judge
          ? `${caseData.first_name} ${caseData.last_name}`
          : "N/A";
        return {
          ...caseData,
          judgeName: judgeName,
        };
      });

      console.log("Cases with judges:", casesWithJudges);
      setFetchedCases(casesWithJudges);
    } catch (error) {
      console.error("Error fetching case count:", error);
    }
  };

  // Inside the fetchDocuments function
  const fetchDocuments = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(accessToken);
      const prosecutorId = decodedToken.userId; // Get the userId from the decoded JWT token

      const response = await fetch(
        "http://localhost:8081/api/fetchproscutorcases",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prosecutorId }), // Send the prosecutorId to the backend server
        }
      );
      const data = await response.json();
      setData(data);
      console.log("data", data);
      const allintieatedcases = data.length;
      setAllintieatedcase(allintieatedcases);
      // Filter the fetched data to get cases with status "approved"
      const approvedCases = data.filter(
        (caseData) => caseData.status === "approved"
      );

      // Get the count of approved cases
      const approvedCasesCount = approvedCases.length;

      // Update the state or use the count directly to display in the StatBox
      setDatas(approvedCasesCount); // Assuming you want to store the approved cases in state for further use
      // You can also directly use the count for display if not needed elsewhere
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchJudge();
    fetchCaseCount();
    fetchDocuments();
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
            subtitle="Total Cases"
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
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={datas}
            subtitle="Approved intiated case by registrar"
            progress={approvedintieatedcasepersentage / 100}
            increase={`+${approvedintieatedcasepersentage}%`}
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
              Cases with Judges
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
              Case ID
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Case Status
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Case Type
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Judge Name
            </Typography>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Judge ID
            </Typography>
          </Box>
          {fetchedCases.map((caseData, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Typography color={colors.greenAccent[500]} variant="h5">
                {caseData.case_id}
              </Typography>
              <Typography color={colors.grey[100]}>
                {caseData.case_status}
              </Typography>
              <Typography color={colors.grey[100]}>
                {caseData.case_type}
              </Typography>
              <Typography color={colors.grey[100]}>
                {caseData.judgeName}
              </Typography>
              <Typography color={colors.grey[100]}>{caseData.id}</Typography>
            </Box>
          ))}
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="10px"
        >
          <Typography
            variant="h3"
            color={colors.blueAccent[500]}
            fontWeight="600"
          >
            Initiated Cases
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle
              inactivePercentage
              progress={100 / 100}
              increase={`+${100}%`}
              size="125"
            />
            <Typography
              variant="h2"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {allintieatedcase}
            </Typography>
            <Typography>
              {" "}
              all intiated cases by proscutor including the not approved cases{" "}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProscutorDashboard;
