import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

function AdoptionForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Send data back to the parent (Home)
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Adoption Request Form
      </Typography>
      <TextField
        label="Your Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Your Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Message (Optional)"
        name="message"
        value={formData.message}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AdoptionForm;
