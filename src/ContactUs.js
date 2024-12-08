import React from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

function ContactUs() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4, textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Contact Us
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Have questions or need support? Get in touch with us using the form below.
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField label="Name" variant="outlined" fullWidth />
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
        />
        <Button variant="contained" color="primary" size="large">
          Send Message
        </Button>
      </Box>
    </Container>
  );
}

export default ContactUs;
