import React, { useState, useEffect } from "react";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
//import apiClient from "./api"; // Ensure you have apiClient configured correctly

import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import AdoptionForm from "./Adoptionform";
import PetDetailsModal from "./PetDetailsModal";

import "./styles.css"; // Create a separate CSS file for animations

function addImagesToPets(pets) {
  // Hardcoded image URLs for the first 30 pets
  const hardcodedPetImages = [
    "https://placedog.net/400/300",
    "https://placedog.net/401/300",
    "https://placedog.net/402/300",
    "https://placedog.net/403/300",
    "https://placedog.net/404/300",
    "https://placedog.net/405/300",
    "https://placedog.net/406/300",
    "https://placedog.net/407/300",
    "https://placedog.net/408/300",
    "https://placedog.net/409/300",
    "https://placedog.net/410/300",
    "https://placedog.net/411/300",
    "https://placedog.net/412/300",
    "https://placedog.net/413/300",
    "https://placedog.net/414/300",
    "https://placedog.net/415/300",
    "https://placedog.net/416/300",
    "https://placedog.net/417/300",
    "https://placedog.net/418/300",
    "https://placedog.net/419/300",
    "https://placedog.net/420/300",
    "https://placedog.net/421/300",
    "https://placedog.net/422/300",
    "https://placedog.net/423/300",
    "https://placedog.net/424/300",
    "https://placedog.net/425/300",
    "https://placedog.net/426/300",
    "https://placedog.net/427/300",
    "https://placedog.net/428/300",
    "https://placedog.net/429/300",
  ];

  // Dynamically generate image URLs for pets beyond the first 30
  const dynamicPetImage = (index) =>
    `https://placedog.net/${400 + (index % 100)}/${300 + (index % 50)}`;

  // Assign images to pets
  return pets.map((pet, index) => ({
    ...pet,
    image:
      index < hardcodedPetImages.length
        ? hardcodedPetImages[index]
        : dynamicPetImage(index),
  }));
}

function parseArrayToObjects(data) {
  // Define the keys to be used for each object
  const keys = [
    "id",
    "PetName",
    "PetType",
    "Breed",
    "age",
    "PetSize",
    "Gender",
    "HealthStatus",
    "VaccinationStatus",
    "Availability"
  ];

  // Map each sub-array into an object using the keys
  return data.map((item) => {
    const obj = {};
    keys.forEach((key, index) => {
      obj[key] = item[index];
    });
    return obj;
  });
}

function Home({ onRequestSubmit = () => {} }) {
  console.log("Component Rendered");
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPets, setFilteredPets] = useState([]);
  const [pets, setPets] = useState([]); // New state to store the fetched pets data
  
  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pets");

     

      const data = await response.json();
      console.log(data); // Verify data in console
      const parsedData = parseArrayToObjects(data);
      const parsedDatawithImages = addImagesToPets(parsedData);


      setPets(parsedDatawithImages); // Update state with fetched data
      setFilteredPets(parsedDatawithImages); // Assuming you want to use the same data for filteredPets

    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  useEffect(() => {
    console.log("Here");
    fetchPets();
  }, []); // Empty dependency array means this runs once when the component mounts
  
  // Search handler
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPets(
      pets.filter(
        (pet) =>
          pet.PetName.toLowerCase().includes(query) ||
          pet.Breed.toLowerCase().includes(query) ||
          pet.PetType.toLowerCase().includes(query) ||
          pet.PetSize.toLowerCase().includes(query) ||
          pet.Gender.toLowerCase().includes(query) ||
          pet.HealthStatus.toLowerCase().includes(query) ||
          pet.VaccinationStatus.toLowerCase().includes(query) ||
          pet.Availability.toLowerCase().includes(query)
      )
    );
  };
  
  const handleFormOpen = (pet) => {
    setSelectedPet(pet);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedPet(null);
    console.log("hamza");
  };

  const handleDetailsOpen = (pet) => {
    setSelectedPet(pet);
    setOpenDetails(true);
  };

  const handleDetailsClose = () => {
    setOpenDetails(false);
    setSelectedPet(null);
  };

  const handleRequestSubmit = async (formData) => {
    const adoptionRequest = {
      petId: selectedPet.id, // Assuming `id` is the key for pet ID
      email: formData.email,
      comments: formData.comments,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/adoption-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adoptionRequest),
      });
  
      if (response.ok) {
        alert("Adoption request submitted successfully!");
      } else {
        const error = await response.json();
        console.error("Failed to submit adoption request:", error);
        alert("Failed to submit adoption request. Please try again.");
      }
    } catch (error) {
      console.error("Error while submitting adoption request:", error);
      alert("An error occurred. Please check your internet connection and try again.");
    }
  };
  
 
  return (
    
    <div>
    {/* Hero Section */}
    <div
style={{
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "50%", // Adjusted height
  backgroundImage: `url('https://images.pexels.com/photos/4453160/pexels-photo-4453160.jpeg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1,
}}
></div>
<div
style={{
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "50%", // Match the background height
  backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3))",
  zIndex: 2,
}}
></div>
      <div
  style={{
    position: "relative",
    zIndex: 3,
    color: "#000",
    textAlign: "center",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  }}
>
  <Typography
    variant="h1"
    style={{
      fontWeight: "bold",
      textShadow: "2px 2px 8px rgba(255, 255, 255, 0.5)",
      letterSpacing: "2px",
      marginBottom: "20px",
      color: "#3B3A3A", // Neutral dark gray for bold elegance
      animation: "fadeIn 1s ease-out",
    }}
  >
    Find Your Forever Friend!
  </Typography>

  <Typography
    variant="h5"
    style={{
      maxWidth: "700px",
      color: "#FFFFF", // Soft gray for body text
      textShadow: "1px 1px 6px rgba(255, 255, 255, 0)",
      lineHeight: "1.6",
      fontWeight: "500",
      animation: "slideUp 1s ease-out",
    }}
  >
    Dive into the world of unconditional love. Explore our pet adoption system and meet adorable animals waiting to be part of your life.
  </Typography>

  <button
    style={{
      marginTop: "20px",
      padding: "10px 30px",
      fontSize: "16px",
      color: "#FFF",
      backgroundColor: "#FF6347", // Warm coral color for action button
      border: "none",
      borderRadius: "20px",
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
    }}
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#FF7F50")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF6347")}
  >
    Browse Pets
  </button>
</div>

      {/* Pet Cards Section */}
      <div
        id="pet-cards-section"
        style={{
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(100px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "30px",
            letterSpacing: "2px",
          }}
        >
          Available Pets for Adoption
        </Typography>

        {/* Search Bar */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Paper
            component="form"
            elevation={3}
            style={{
              display: "flex",
              alignItems: "center",
              width: "350px",
              margin: "0 auto",
              borderRadius: "25px",
              padding: "2px 10px",
            }}
          >
            <SearchIcon style={{ marginRight: "10px", color: "#888" }} />
            <InputBase
              placeholder="Search by name or breed..."
              value={searchQuery}
              onChange={handleSearch}
              style={{
                flex: 1,
                fontSize: "16px",
                color: "#333",
              }}
            />
          </Paper>
        </div>

        {/* Pet Cards */}
        <Grid container spacing={4} justifyContent="center">
  {filteredPets?.map((pet) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={pet.PetID}>
      <Card
        className="fade-in-card"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={pet?.image} // Ensure that you have pet.image in your data
          alt={pet?.PetName}
        />
        <CardContent>
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", color: "#333" }}
          >
            {pet?.PetName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {pet?.PetType} - {pet?.Breed}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Age: {pet?.age} years
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Size: {pet?.PetSize}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Gender: {pet?.Gender}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Health: {pet?.HealthStatus}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Vaccination: {pet?.VaccinationStatus}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Availability: {pet?.Availability}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginRight: "150px", marginLeft: "30px", width: "500", marginTop: "10px" }}
            onClick={() => handleFormOpen(pet)}
          >
            Adopt Me
          </Button>
          
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


        {/* Adoption Form Modal */}
        <Modal open={openForm} onClose={handleFormClose}>
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "90%",
      maxWidth: "400px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    }}
  >
    <AdoptionForm
  onSubmit={(data) => {
    handleRequestSubmit(data); // Call the updated function
    handleFormClose();
  }}
  onClose={handleFormClose}
/>

  </div>
</Modal>


        {/* Pet Details Modal */}
        <Modal open={openDetails} onClose={handleDetailsClose}>
          <PetDetailsModal pet={selectedPet} onClose={handleDetailsClose} />
        </Modal>
      </div>
    </div>
  );
}

export default Home;
