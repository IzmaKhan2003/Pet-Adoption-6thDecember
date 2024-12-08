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
  // List of random pet image URLs
  const petImages= [
    "https://placedog.net/400/300",
    "https://placekitten.com/400/300",
    "https://random.dog/woof.json",
    "https://cataas.com/cat",
    "https://loremflickr.com/320/240/dog",
    "https://loremflickr.com/320/240/cat",
    "https://placedog.net/500/400",
    "https://placekitten.com/500/400",
    "https://loremflickr.com/320/240/pet",
    "https://source.unsplash.com/featured/?pet"
  ];
  

  // Add a random image to each pet object
  return pets.map((pet) => ({
    ...pet,
    image: petImages[Math.floor(Math.random() * petImages.length)]
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

 
  return (
    
    <div>
      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          backgroundImage: `url('https://t3.ftcdn.net/jpg/07/06/99/66/240_F_706996604_gJwDZH3g2GV27TNdnHvUsmUsP7SzQody.jpg')`,
          backgroundSize: "100%",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundBlendMode: "color-dodge",
            zIndex: 1,
          }}
        ></div>
        <div
          style={{
            position: "relative",
            zIndex: 2,
            color: "white",
            textAlign: "center",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              textShadow: "3px 3px 10px rgba(0, 0, 0, 0.8)",
              letterSpacing: "2px",
              marginBottom: "20px",
              color: "#FFD777",
            }}
          >
            Find Your New Furry Best Friend!
          </Typography>

          <Typography
            variant="h6"
            style={{
              maxWidth: "600px",
              color: "#FFD777",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
              lineHeight: "1.6",
            }}
          >
            Welcome to the Pet Adoption System, where unconditional love awaits
            you. Explore adorable pets, each with a story, and give them a
            loving forever home. Scroll down to meet your new furry companion!
          </Typography>
        </div>
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
            style={{ marginRight: "10px" }}
            onClick={() => handleFormOpen(pet)}
          >
            Adopt Me
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleDetailsOpen(pet)}
          >
            View Details
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
                onRequestSubmit({ ...data, pet: selectedPet });
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
