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
const RegistrarDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null); // State to store fetched data
  const [datas, setDatas] = useState(null); // State to store fetched data

  const [userData, setUserData] = useState([]);
  const [criminalJudges, setCriminalJudges] = useState([]);
  const [civilJudges, setCivilJudges] = useState([]);
  const [fetchedCases, setFetchedCases] = useState([]);

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
  const fetchData = async () => {
    try {
      console.log("Fetching client data...");
      const response = await fetch(
        "http://localhost:8081/api/getJoinedClientData"
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching joined client data: ${response.statusText}`
        );
      }

      const result = await response.json();
      setData(result);
      console.log("Client data fetched successfully:", result);
    } catch (error) {
      console.error("Error fetching joined client data:", error);
    } finally {
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
  const fetchAdvocatorData = async () => {
    try {
      console.log("Fetching advocator data...");
      const response = await fetch(
        "http://localhost:8081/api/getAdvocatorData"
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching advocator data: ${response.statusText}`
        );
      }

      const result = await response.json();

      // Map the fetched data and rename 'advocator_id' to 'id'
      const formattedData = result.map((advocator) => ({
        id: advocator.advocator_id,
        first_name: advocator.first_name,
        middle_name: advocator.middle_name,
        last_name: advocator.last_name,
        gender: advocator.gender,
        email: advocator.email,
        mobile_number: advocator.mobile_number,
        address: advocator.address,
      }));

      setDatas(formattedData);
      console.log("Advocator data fetched successfully:", formattedData);
    } catch (error) {
      console.error("Error fetching advocator data:", error);
    }
  };
  useEffect(() => {
    fetchJudge();
    fetchCaseCount();
    fetchData();
    fetchAdvocatorData();
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
          gridColumn="span 3"
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
          p="30px"
          borderRadius="10px"
        >
          <Typography
            color={colors.blueAccent[500]}
            variant="h4"
            fontWeight="600"
          >
            Registerd Clients
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
              {data ? data.length.toString() : "0"}
            </Typography>
            <Typography>
              {" "}
              all petioner and respondants are considerd as clients{" "}
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="10px"
        >
          <Typography
            color={colors.blueAccent[500]}
            variant="h4"
            fontWeight="600"
          >
            Registerd Advocators
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
              {datas ? datas.length.toString() : "0"}
            </Typography>
            <Typography> all Registered advocators</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrarDashboard;
