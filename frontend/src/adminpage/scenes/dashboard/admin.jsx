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
import { GavelOutlined, PeopleOutline } from "@mui/icons-material";
import GeographyChart from "../../components/GeographyChart";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { FaUsers } from "react-icons/fa";
const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null); // State to store fetched data
  const [userData, setUserData] = useState([]);
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
    (userCounts.invoice_clerk / userCounts.all) *
    100
  ).toFixed(2);
  const proscutorPercentage = (
    (userCounts.proscuter / userCounts.all) *
    100
  ).toFixed(2);
  const registrarPercentage = (
    (userCounts.registrar / userCounts.all) *
    100
  ).toFixed(2);
  const inactivePercentage = (
    (userCounts.inactive / userCounts.all) *
    100
  ).toFixed(2);
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/getUsers");
      const data = await response.json();

      // Update the status property based on the backend data
      const updatedData = data.map((user) => ({
        ...user,
        status: user.status === "Activated",
      }));

      setUserData(updatedData);
      console.log(updatedData);

      // Count the number of users by role
      const counts = updatedData.reduce(
        (acc, user) => {
          acc[user.role.toLowerCase()]++;
          acc.all++;
          if (!user.status) {
            acc.inactive++;
          }
          return acc;
        },
        {
          all: 0,
          judge: 0,
          invoice_clerk: 0,
          registrar: 0,
          proscuter: 0,
          inactive: 0,
        }
      );

      setUserCounts(counts);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box padding="40px" backgroundColor={colors.blueAccent[900]}>
      {/* HEADER */}
      <Box
        sx={{ mb: "100px" }}
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
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={userCounts.all.toString()}
            subtitle="All Registered Users"
            progress={allPercentage / 100}
            increase={`+${allPercentage}%`}
            icon={
              <PeopleOutline
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="10px"
        >
          <StatBox
            title={userCounts.judge.toString()}
            subtitle="Total Judge"
            progress={judgePercentage / 100}
            increase={`+${judgePercentage}%`}
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
            title={userCounts.proscuter.toString()}
            subtitle="Total proscutor"
            progress={proscutorPercentage / 100}
            increase={`+${proscutorPercentage}%`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
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
            title={userCounts.registrar.toString()}
            subtitle="Totol Registrars"
            progress={registrarPercentage / 100}
            increase={`+${registrarPercentage}%`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
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
            title={userCounts.invoice_clerk.toString()}
            subtitle="Total Invoice Clerk"
            progress={invoiceClerkPercentage / 100}
            increase={`+${invoiceClerkPercentage}%`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              User Data
            </Typography>
          </Box>
          {userData.map((user, index) => (
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
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography color={colors.grey[100]}>{user.role}</Typography>
              </Box>
              <Box>
                <Typography color={colors.grey[100]}>{user.email}</Typography>
              </Box>
              <Box>
                <Typography color={colors.grey[100]}>
                  {user.status ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="10px"
        >
          <Typography variant="h5" fontWeight="600">
            Deactive Users
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle
              inactivePercentage
              progress={inactivePercentage / 100}
              increase={`+${inactivePercentage}%`}
              size="125"
            />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {userCounts.inactive.toString()}
            </Typography>
            <Typography> users deactivated by admin </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
