import React from "react";
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
import { GavelOutlined } from "@mui/icons-material";

const RegistrarDashboard = ({
  showRecentTransactions,
  showCampaign,
  showCalendar,
  statBoxes,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
        {statBoxes.map((statBox, index) => (
          <Box
            key={`statBox${index + 1}`}
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={statBox.title}
              subtitle={statBox.subtitle}
              progress={statBox.progress}
              increase={statBox.increase}
              icon={statBox.icon}
            />
          </Box>
        ))}

        {/* ROW 2 */}
        {showRecentTransactions && (
          <Box
            gridColumn="span 6"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h5"
                fontWeight="600"
              >
                Recent Transactions
              </Typography>
            </Box>
            {mockTransactions.map((transaction, i) => (
              <Box
                key={`${transaction.txId}-${i}`}
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
                    {transaction.txId}
                  </Typography>
                  <Typography color={colors.grey[100]}>
                    {transaction.user}
                  </Typography>
                </Box>
                <Box color={colors.grey[100]}>{transaction.date}</Box>
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                >
                  {transaction.cost} Birr
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* ROW 3 */}
        {showCampaign && (
          <Box
            gridColumn="span 6"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size="125" />
              <Typography
                variant="h5"
                color={colors.greenAccent[500]}
                sx={{ mt: "15px" }}
              >
                48,352 Birr revenue generated
              </Typography>
              <Typography>
                Includes extra misc expenditures and costs
              </Typography>
            </Box>
          </Box>
        )}

        {/* ROW 4 (Calendar) */}
        {showCalendar && (
          <Box
            gridColumn="span 12"
            gridRow="span 8"
            backgroundColor={colors.primary[400]}
            padding="20px"
          >
            <Calendar />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RegistrarDashboard;
