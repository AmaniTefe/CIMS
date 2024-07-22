import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
const Pie = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box padding='20px' backgroundColor={colors.blueAccent[900]}>
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
