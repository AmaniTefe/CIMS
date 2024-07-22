import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import {
  GavelOutlined,
  GavelRounded,
  GavelSharp,
  PeopleOutline,
} from "@mui/icons-material";
import { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios";
const InvoiceDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(null); // State to store fetched data
  const [datas, setDatas] = useState(null); // State to store fetched data
  const [allintieatedcase, setAllintieatedcase] = useState(null);
  const [services, setServices] = useState([]);
  const [criminalJudges, setCriminalJudges] = useState([]);
  const [civilJudges, setCivilJudges] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [allCasesCount, setAllCasesCount] = useState(0);

  const [paidStatusCounts, setPaidStatusCounts] = useState({
    Paid: 0,
    "Partially Paid": 0,
    Unpaid: 0,
  });
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
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
  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/getServices");
      const formattedData = response.data.map((service, index) => ({
        id: service.id,
        Number: index + 1, // Assuming Number is a sequential identifier
        "Service Name": service.name,
        "Service Price": service.amount,
      }));
      setServices(formattedData);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/getinvoices");
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setInvoices(data);
        const totalAmount = data.reduce(
          (total, invoice) => total + invoice.total_amount,
          0
        );
        setTotalInvoiceAmount(totalAmount);
        // Count occurrences of each paid_status
        const counts = {
          Paid: data.filter((invoice) => invoice.paid_status === "Paid").length,
          "Partially Paid": data.filter(
            (invoice) => invoice.paid_status === "Partially Paid"
          ).length,
          Unpaid: data.filter((invoice) => invoice.paid_status === "Unpaid")
            .length,
        };
        setPaidStatusCounts(counts);

        // Count all cases
        setAllCasesCount(data.length);
      } else {
        console.error("Failed to fetch invoices:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

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
  const allInvoicesCount = invoices.length;
  const paidPercentage = (
    (paidStatusCounts.Paid / allInvoicesCount) *
    100
  ).toFixed(2);
  const partiallyPaidPercentage = (
    (paidStatusCounts["Partially Paid"] / allInvoicesCount) *
    100
  ).toFixed(2);
  const unpaidPercentage = (
    (paidStatusCounts.Unpaid / allInvoicesCount) *
    100
  ).toFixed(2);
  useEffect(() => {
    fetchServices();
    fetchInvoices();
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
            title={invoices.length}
            subtitle="All Invoices"
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
            title={paidStatusCounts["Partially Paid"]}
            subtitle=" Partially Paid Invoices"
            progress={partiallyPaidPercentage / 100}
            increase={`+${partiallyPaidPercentage}%`}
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
            title={paidStatusCounts.Paid}
            subtitle="Paid Invoices"
            progress={paidPercentage / 100}
            increase={`+${paidPercentage}%`}
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
            title={paidStatusCounts.Unpaid}
            subtitle="Unpaid Invoices"
            progress={unpaidPercentage / 100}
            increase={`+${unpaidPercentage}%`}
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
            title={` ${totalInvoiceAmount} Birr`}
            subtitle="total income generated from all services"
            progress={100 / 100}
            increase={`+${100}%`}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "46px" }}
              />
            }
          />
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          borderRadius="10px"
        >
          <Box>
            <Typography
              alignItems={"center"}
              variant="h3"
              fontWeight="600"
              color={colors.blueAccent[500]}
              padding={3}
            >
              Services
            </Typography>
          </Box>
          <Box
            backgroundColor={colors.primary[400]}
            overflow="auto"
            borderRadius="10px"
          >
            <Box
              display="flex"
              flexDirection="column" // Change to column for proper alignment
              colors={colors.grey[100]}
              p="5px"
            >
              {/* Display column headers */}
              <Box mb={1} display="flex" justifyContent="space-between">
                <Typography color={colors.greenAccent[400]} variant="h4">
                  Number
                </Typography>
                <Typography color={colors.greenAccent[400]} variant="h4">
                  Service Name
                </Typography>
                <Typography color={colors.greenAccent[400]} variant="h4">
                  Service Amount
                </Typography>
              </Box>
              {/* Display services */}
              {services.map((service, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  p={2}
                  marginBottom="10px"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                >
                  <Typography color={colors.grey[100]} variant="h5">
                    {service.Number} {/* Use service.Number */}
                  </Typography>
                  <Typography color={colors.grey[100]} variant="h5">
                    {service["Service Name"]}{" "}
                    {/* Use service["Service Name"] */}
                  </Typography>
                  <Typography color={colors.grey[100]} variant="h5">
                    {service["Service Price"]}{" "}
                    {/* Use service["Service Price"] */}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceDashboard;
