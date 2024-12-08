import React, { useState } from "react";
import PropTypes from "prop-types"; // For prop validation
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  Alert,
} from "@mui/material";

const GiveUpPetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    adopterName: "",
    contactInfo: "",
    petName: "",
    petRecentHealth: "",
    petVaccinationUpdates: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      adopterName,
      contactInfo,
      petName,
      petRecentHealth,
      petVaccinationUpdates,
    } = formData;

    if (!adopterName || !contactInfo || !petName || !petRecentHealth || !petVaccinationUpdates) {
      setError("Please fill out all required fields.");
      return;
    }

    setError("");
    onSubmit(formData); // Call the provided onSubmit function
    alert("Follow-up information submitted successfully!");
    setFormData({
      adopterName: "",
      contactInfo: "",
      petName: "",
      petRecentHealth: "",
      petVaccinationUpdates: "",
    });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "30px" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Follow-Up Form
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Your Name"
                  name="adopterName"
                  fullWidth
                  value={formData.adopterName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contact Information"
                  name="contactInfo"
                  fullWidth
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Pet's Name"
                  name="petName"
                  fullWidth
                  value={formData.petName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Recent Health Updates"
                  name="petRecentHealth"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.petRecentHealth}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Vaccination Updates"
                  name="petVaccinationUpdates"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.petVaccinationUpdates}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

// Provide a default onSubmit implementation to avoid errors
GiveUpPetForm.defaultProps = {
  onSubmit: () => {
    console.warn("onSubmit function not provided!");
  },
};

// Validate that onSubmit is a function
GiveUpPetForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default GiveUpPetForm;
