import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import {  useTheme } from "@mui/material";
import { tokens } from "../../../theme";
const Line = () => {
 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box padding='20px' backgroundColor={colors.blueAccent[900]}>
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
