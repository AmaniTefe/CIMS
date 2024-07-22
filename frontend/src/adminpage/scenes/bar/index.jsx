import { Box,useTheme } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { tokens } from "../../../theme";
const Bar = () => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box padding='20px' backgroundColor={colors.blueAccent[900]}>
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="110vh" paddingBottom='25vh'>
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
