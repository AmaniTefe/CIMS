import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./adminpage/admin";
import Admins from "./adminpage/judge";
import Adminss from "./adminpage/registrar";
import CourtManager from "./adminpage/court_manager";
import Invoiclerk from "./adminpage/invoice_clerk";
import Proscutor from "./adminpage/proscutor";
import Form from "./adminpage/scenes/form";
import Team from "./adminpage/scenes/team";
import Contacts from "./adminpage/scenes/contacts";
import Invoices from "./adminpage/scenes/invoices/index";
import Calendar from "./adminpage/scenes/calendar/calendar";
import FAQ from "./adminpage/scenes/faq";
import Bar from "./adminpage/scenes/bar";
import Pie from "./adminpage/scenes/pie";
import Line from "./adminpage/scenes/line";
import Geography from "./adminpage/scenes/geography";
import RegistrarDashboard from "./adminpage/scenes/registrardashboard copy";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AddInvoices from "./adminpage/scenes/invoices/addinvoices";
import AddClient from "./adminpage/scenes/addclient/addclient";
import Advocator from "./adminpage/scenes/advocator/viewadvocator";
import AddAdvocator from "./adminpage/scenes/advocator/addAdvocator";
import Appointmentform from "./adminpage/scenes/Appointment/appointmentform";
import Appointment from "./adminpage/scenes/Appointment";
import Client from "./adminpage/scenes/client";
import AddCase from "./adminpage/scenes/addcase/addcase";
import AddCourtRegistrarCase from "./adminpage/scenes/addcase/addcasecourtmanager";
import ReceiveEmail from "./forgot_password/receive_user_email";
import AddCaseJudge from "./adminpage/scenes/addcase/addcasejudge";
import Caseform from "./adminpage/scenes/form/caseform";
import ProfilePage from "./adminpage/scenes/profile";
import ViewProfilePage from "./adminpage/scenes/profile";
import NotFound from "./adminpage/scenes/global/pagenotfound";
import Casetype from "./adminpage/scenes/case/casetype";
import FetchProscuterCases from "./adminpage/scenes/proscutor/fetchcase";
import {
  GavelRounded,
  HailRounded,
  PedalBikeOutlined,
} from "@mui/icons-material";

import Deactive from "./pages/deactive";
import AddServices from "./adminpage/scenes/services/addservices";
import ConfirmedPage from "./forgot_password/confirmedPage";
import ResetPassword from "./forgot_password/receive_new_password";
import ViewProfilePages from "./adminpage/scenes/profile/profile";
import UploadProscutorDocumentPage from "./adminpage/scenes/proscutor/index";
import ProscutoreDocuments from "./adminpage/scenes/proscutor/fetchproscuterdocument";
import ProscutorCases from "./adminpage/scenes/registrar";
import InvoiceDetail from "./adminpage/scenes/invoices/invoiceDetailspage";

const App = () => {
  const [theme, colorMode] = useMode();
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthenticated(true);
      const role = getUserRoleFromToken(token);
      setUserRole(role);
    }
  }, []);

  const getUserRoleFromToken = (token) => {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    console.log(decodedToken);
    return decodedToken.role_name;
  };

  const RedirectToDashboard = () => {
    if (!authenticated) {
      return <Navigate to="/login" />;
    } else {
      switch (userRole) {
        case "Admin":
          return <Navigate to="/admin" />;
        case "Judge":
          return <Navigate to="/judge" />;
        case "Proscutor":
          return <Navigate to="/proscuter" />;
        default:
          return <Navigate to="/login" />;
      }
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<RedirectToDashboard />} />
            <Route
              path="/login"
              element={
                <Login
                  setAuthenticated={setAuthenticated}
                  setUserRole={setUserRole}
                />
              }
            />
            {authenticated && (
              <>
                {userRole === "Proscuter" && (
                  <Route path="/proscuter/*" element={<ProscutorRoutes />} />
                )}
                {userRole === "Judge" && (
                  <Route path="/judge/*" element={<JudgeRoutes />} />
                )}
                {userRole === "Admin" && (
                  <Route path="/admin/*" element={<AdminRoutes />} />
                )}
                {userRole === "Registrar" && (
                  <Route path="/registrar/*" element={<RegistrarRoutes />} />
                )}

                {userRole === "Court_Manager" && (
                  <Route
                    path="/court_manager/*"
                    element={<CortManagerRoutes />}
                  />
                )}
                {userRole === "Invoice_Clerk" && (
                  <Route
                    path="/invoice_clerk/*"
                    element={<InvoiceClerkRoutes />}
                  />
                )}
              </>
            )}

            <Route path="/deactive" element={<Deactive />} />
            <Route path="/forgot-password" element={<ReceiveEmail />} />
            <Route
              path="/user/resetPassword/:token"
              element={<ResetPassword />}
            />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/unauthorized"
              element={<p color="black">Unauthorized</p>}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const RegistrarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Adminss />}>
        <Route path="/caseform" element={<Caseform />} />
        <Route path="/casethatcomefromproscutor" element={<ProscutorCases />} />
        <Route path="/addinvoices" element={<AddInvoices />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/form" element={<Form />} />
        <Route path="/addcase" element={<AddCase />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/pie" element={<Pie />} />
        <Route path="/geography" element={<Geography />} />
        <Route path="/bar" element={<Bar />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/addadvocator" element={<AddAdvocator />} />
        <Route path="/viewadvocator" element={<Advocator />} />
        <Route path="/viewclient" element={<Client />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointmentform" element={<Appointmentform />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/viewprofilepage" element={<ViewProfilePages />} />
        <Route path="/casetype" element={<Casetype />} />
        <Route path="/services" element={<AddServices />} />
        <Route path="/casecourtmanager" element={<AddCourtRegistrarCase />} />
      </Route>
    </Routes>
  );
};

const JudgeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admins />}>
        <Route path="/casejudge" element={<AddCaseJudge />} />
        <Route path="team" element={<Team />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="form" element={<Form />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="pie" element={<Pie />} />
        <Route path="geography" element={<Geography />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/viewprofilepage" element={<ViewProfilePages />} />
        <Route path="/caseform" element={<Caseform />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointmentform" element={<Appointmentform />} />
      </Route>
    </Routes>
  );
};
const CortManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CourtManager />}>
        <Route path="/casejudge" element={<AddCaseJudge />} />
        <Route path="team" element={<Team />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="form" element={<Form />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="pie" element={<Pie />} />
        <Route path="geography" element={<Geography />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/viewprofilepagefasdfa" element={<ViewProfilePages />} />
        <Route path="/casecourtmanager" element={<AddCourtRegistrarCase />} />
      </Route>
    </Routes>
  );
};

const InvoiceClerkRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Invoiclerk />}>
        <Route path="/casejudge" element={<AddCaseJudge />} />
        <Route path="team" element={<Team />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="form" element={<Form />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="pie" element={<Pie />} />
        <Route path="geography" element={<Geography />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/viewprofilepagefasdfa" element={<ViewProfilePages />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/viewprofilepage" element={<ViewProfilePages />} />
        <Route path="/services" element={<AddServices />} />
        <Route path="/addinvoices" element={<AddInvoices />} />
        <Route path="/invoicedetail/:invoiceId" element={<InvoiceDetail />} />
      </Route>
    </Routes>
  );
};
const ProscutorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Proscutor />}>
        <Route path="/casejudge" element={<AddCaseJudge />} />
        <Route path="team" element={<Team />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="form" element={<Form />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="pie" element={<Pie />} />
        <Route path="geography" element={<Geography />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/viewprofilepagefasdfa" element={<ViewProfilePages />} />
        <Route path="/caseform" element={<Caseform />} />
        <Route path="/proscutercase" element={<FetchProscuterCases />} />
        <Route
          path="/proscuter_intiate_case"
          element={<UploadProscutorDocumentPage />}
        />

        <Route path="proscutordocument" element={<ProscutoreDocuments />} />
        <Route path="/addcase" element={<AddCase />} />
      </Route>
    </Routes>
  );
};
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route path="team" element={<Team />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="form" element={<Form />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="bar" element={<Bar />} />
        <Route path="pie" element={<Pie />} />
        <Route path="line" element={<Line />} />
        <Route path="geography" element={<Geography />} />
        <Route path="addcase" element={<AddCase />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/viewprofilepage" element={<ViewProfilePage />} />
      </Route>
    </Routes>
  );
};

export default App;
