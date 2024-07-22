import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import MainNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import Clock from "../components/clock";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../theme";
import Ap from "../image/court/ff.png";
import Lottie from "react-lottie";
import animationData from "../a.json";
import { TextField, Button } from "@mui/material";
import newAnimationData from "./newAnimationData.json";
import "../components/navbar.css";
import "./loader.css";
// Background animation component with fixed positioning and higher z-index
const BackgroundAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "2vw",
        height: "2vh",
        zIndex: -1, // Set a higher z-index to ensure it covers other elements
      }}
    >
      <Lottie
        options={defaultOptions}
        height={750}
        width={1800}
        isClickToPauseDisabled
      />
    </div>
  );
};

const Logo = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <img
      src={Ap}
      alt="Logo"
      style={{
        width: "299px",
        height: "187px",
        marginBottom: "5px",
        borderRadius: "10px",
      }}
    />
    <h1 className="text" style={{ textAlign: "center", marginBottom: "3px" }}>
      LOGIN
    </h1>
  </div>
);
const getUserRoleFromToken = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.role_name;
};
const getUSerID = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  return decodedToken.userId;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode) || {};
  const colorMode = useContext(ColorModeContext);
  const [loadingButton, setLoadingButton] = useState(false);
  const [newAnimationDataState, setNewAnimationDataState] =
    useState(newAnimationData);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "85%",
      width: "100%", // Ensure container fills the viewport width
      marginTop: "0px",
      // Remove background color to allow animation to fill the space
      backgroundColor: `${colors.primary[600]}`,
    },
    form: {
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "380px",
      width: "100%",
      boxShadow: "0 0 90px rgba(0, 0, 0, 0.9)",
      backdropFilter: "blur(10px)",
      backgroundColor: `${colors.primary[400]}90`,

      marginLeft: "30%",
    },
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const logTokenInfo = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      console.log("Token:", token);

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded Token:", decodedToken);
    } else {
      console.log("Token not found in localStorage");
    }
  };

  const handleLogin = async (e) => {
    try {
      setLoadingButton(true);

      const response = await axios.post(
        "http://localhost:8081/api/login",
        formData
      );

      const accessToken = response.data.token;
      localStorage.setItem("accessToken", accessToken);

      logTokenInfo();

      toast.success("Login successful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const token = localStorage.getItem("accessToken");
      const role_name = getUserRoleFromToken(token);
      const role = role_name.toLowerCase();

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userStatus = decodedToken.status.toLowerCase();

      // Log the user role and status for debugging
      console.log("User Role:", role);
      console.log("User Status:", userStatus);

      // Store role in localStorage
      localStorage.setItem("userRole", role);

      setLoadingButton(false);

      // Reload the page
      window.location.href = window.location.href; // reload the page
    } catch (error) {
      setLoadingButton(false);

      if (error.response) {
        toast.error(`Login failed: ${error.response.data.message}`);
        if (error.response?.status === 401) {
          setErrors({
            email: "Invalid email or password",
            password: "",
          });
        }
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    }
  };
  window.onload = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userStatus = decodedToken.status.toLowerCase();

      if (userStatus === "activated") {
        const role_name = getUserRoleFromToken(token);
        const role = role_name.toLowerCase();

        navigate(`/${role}`);
      } else {
        navigate("/deactive");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    const newErrors = {};

    if (formData.email === "") {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password === "") {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password should be at least 4 characters";
    }

    setErrors(newErrors);

    // If there are no errors, proceed with login
    if (Object.keys(newErrors).length === 0) {
      handleLogin();
    }
  };

  return (
    <>
      <BackgroundAnimation />
      <MainNavbar />
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Clock />
          <div style={{ ...styles.container }}>
            <form style={{ ...styles.form }} onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "10px",
                  marginTop: "1px",
                  color: colors.grey[200],
                  fontFamily: '"Trirong", serif',
                }}
              >
                <Logo />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <TextField
                  fullWidth
                  variant="standard"
                  id="email"
                  name="email"
                  margin="normal"
                  label="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      email: e.target.value,
                    }))
                  }
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>

              <div style={{ marginBottom: "5px" }}>
                <TextField
                  fullWidth
                  variant="standard"
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      password: e.target.value,
                    }))
                  }
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                disabled={loadingButton}
                fullWidth
                style={{
                  marginTop: "10px",
                  backgroundColor: `${colors.primary[600]}`,
                }}
              >
                {loadingButton ? (
                  <div className=".loader-container">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                {" "}
                forgot password
              </Link>
            </form>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
      <Footer />
    </>
  );
};

export default LoginForm;
