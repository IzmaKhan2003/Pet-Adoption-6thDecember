import React from "react";
import { Container, Typography } from "@mui/material";

function AboutUs() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4, textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        About Us
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        At Pet Adoption Hub, we are committed to connecting adorable pets with loving families.
        Our mission is to create a better world for pets and humans alike by ensuring every animal
        has a chance at a happy life in a forever home.
      </Typography>
      <Typography variant="body1">
        Our team is passionate about animal welfare and is here to support you at every step of the adoption journey.
      </Typography>
    </Container>
  );
}

export default AboutUs;
