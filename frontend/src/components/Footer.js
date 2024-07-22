import React, { useContext } from "react";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";

export default function Footer() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Define inline styles for the footer
  const footerStyle = {
    backgroundColor: colors.primary[700],
    textAlign: "center",
    padding: "15px 0",
    boxShadow: "6px",
    color: colors.primary[200],
    fontSize: "1.6rem", 
   
    
    // This might need adjustment based on your design
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <footer style={footerStyle}>
          <p>© 2024 Court Information Management System. All Rights Reserved.</p>
        </footer>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
