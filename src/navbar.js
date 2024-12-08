import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar({ role, onLogout }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#3f51b5", // Navbar background color
        zIndex: 1200, // Ensures it stays above all content
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            "&:hover": { color: "#FFCA28" },
          }}
        >
          Pet Adoption Hub
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Button
            component={Link}
            to="/"
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#FFCA28" },
            }}
          >
            Home
          </Button>
          {role === "admin" && ( // Only show Admin Panel link for administrators
            <Button
              component={Link}
              to="/admin"
              sx={{
                color: "white",
                fontWeight: "bold",
                "&:hover": { color: "#FFCA28" },
              }}
            >
              Admin Panel
            </Button>
          )}
          <Button
            component={Link}
            to="/GiveUpPetForm"
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#FFCA28" },
            }}
          >
            Follow Up Form
          </Button>
          <Button
            component={Link}
            to="/Aboutus"
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#FFCA28" },
            }}
          >
            About Us
          </Button>
          <Button
            component={Link}
            to="/ContactUs"
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#FFCA28" },
            }}
          >
            Contact Us
          </Button>
          <Button
            onClick={onLogout}
            sx={{
              color: "white",
              fontWeight: "bold",
              "&:hover": { color: "#FFCA28" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
