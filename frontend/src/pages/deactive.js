import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { React, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Topbar from '../components/Navbar';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, tokens } from '../theme';
import { useTheme } from '@mui/material';
function Deactive() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const handleBackButtonClick = () => {
    navigate('/login');
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <Topbar/>
          <Box height={669} bgcolor={colors.primary[800]}>
            <IconButton onClick={handleBackButtonClick} sx={{ position: 'absolute', top: 69, left: 0,  }}>
              <ArrowBack fontSize="large" color="secondary" />
            </IconButton>
            <Typography variant="h3" paddingTop={35} color={colors.redAccent[500]} gutterBottom align="center">
            Your account has been deactivated by the administrator!!
            </Typography>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Deactive;
