import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box, Typography } from "@mui/material";
import Navbar from "./navbar";
import Home from "./Home";
import AdminPanel from "./AdminPanel";
import LoginPage from "./LoginPage";
import GiveUpPetForm from "./GiveUpPetForm";
import ContactUs from "./ContactUs";
import AboutUs from "./Aboutus";


// Utility to check if admin route is accessible
const ProtectedRoute = ({ role, requiredRole, children }) => {
  return role === requiredRole ? children : <Navigate to="/" />;
};


function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Tracks login status
  const [role, setRole] = useState(""); // Tracks user role (user/admin)

  const handleLogin = (selectedRole) => {
    setLoggedIn(true);
    setRole(selectedRole); // Set role based on login
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole(""); // Reset role
  };

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ background: "#f8f8f8", minHeight: "100vh" }}>
        {loggedIn ? (
          <>
            <Navbar role={role} onLogout={handleLogout} />
            <Box
              sx={{
                background: "linear-gradient(to right, #f5f5f5, #eaeaea)",
                minHeight: "100vh",
                paddingTop: "80px",
                paddingX: "20px",
              }}
            >
              <Routes>
                {/* Home Route */}
                <Route path="/" element={<Home/>} />

                {/* Admin Panel (Admin Role Only) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role={role} requiredRole="admin">
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />

                {/* Contact Us Route (Accessible by All Roles) */}
                <Route path="/ContactUs" element={<ContactUs />} />

                {/* About Us Route */}
                <Route path="/Aboutus" element={<AboutUs />} />

                {/* Give Up Pet Form Route */}
                <Route path="/GiveUpPetForm" element={<GiveUpPetForm />} />

                {/* Fallback for undefined routes */}
                <Route
                  path="*"
                  element={
                    <Box textAlign="center" padding="50px">
                      <Typography variant="h4" color="error">
                        Page Not Found
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        The page you're looking for doesn't exist. Return to{" "}
                        <a href="/">Home</a>.
                      </Typography>
                    </Box>
                  }
                />
              </Routes>
            </Box>
          </>
        ) : (
          // Show Login Page if not logged in
          <LoginPage onLogin={handleLogin} />
        )}
      </Box>
    </Router>
  );
}

export default App;
