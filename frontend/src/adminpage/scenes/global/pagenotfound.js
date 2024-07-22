import svg from "./404.svg";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleonClick = () => {
    navigate("/");
  };
  return (
    <div>
      <Box display={"flex"} justifyContent="center" mt={3}>
        <Button variant="contained" color="primary" onClick={handleonClick}>
          Back to Home
        </Button>
      </Box>
      <img src={svg} alt="404" />
    </div>
  );
};

export default NotFound;
