import React from "react";
import { Typography, Button, Box } from "@mui/material";

function PetDetailsModal({ pet, onClose }) {
  return (
    <Box
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {pet.name}'s Health Report
      </Typography>
      <Typography variant="body1">
        <strong>Age:</strong> {pet.age} years
      </Typography>
      <Typography variant="body1">
        <strong>Breed:</strong> {pet.breed}
      </Typography>
      <Typography variant="body1">
        <strong>Vaccination Status:</strong> {pet.vaccinationStatus}
      </Typography>
      <Typography variant="body1">
        <strong>Health Notes:</strong> {pet.healthNotes}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onClose}
        style={{ marginTop: "20px" }}
      >
        Close
      </Button>
    </Box>
  );
}

export default PetDetailsModal;
