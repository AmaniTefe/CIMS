import React from "react";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import Sidebar from "./scenes/global/SidebarRegistrar";
import Topbar from "./scenes/global/Topbar";
import { Outlet, Route, Routes } from "react-router-dom"; // Import Outlet from react-router-dom
import RegistrarDashboard from "./scenes/dashboard/registrar";
import { tokens } from "../theme";

// ... (other imports)
export default function Adminss() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const colors = tokens(theme.palette.mode);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          style={{
            display: "flex",
            height: "100vh",
            backgroundColor: `${colors.blueAccent[900]}`,
            overflow: "hidden",
          }}
        >
          <Sidebar isSidebar={isSidebar} role="registrar" privateImage="" />
          <div style={{ flexGrow: 1, overflowY: "auto" }}>
            <Topbar setIsSidebar={setIsSidebar} />
            <div
              style={{
                overflowY: "auto",
                height: "calc(100vh - 64px)",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* 64px is the height of the Topbar */}
              <Routes>
                <Route index element={<RegistrarDashboard />} />
              </Routes>
              <Outlet />
            </div>
          </div>
          <style>{`
            ::-webkit-scrollbar {
              display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
          `}</style>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
