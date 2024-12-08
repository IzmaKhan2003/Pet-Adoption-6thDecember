
import React, { useState } from "react";

const AddPetForm = ({ onAddPet }) => {
  const [petDetails, setPetDetails] = useState({
    PetName: "",
    PetType: "",
    Breed: "",
    Age: "",
    PetSize: "",
    Gender: "",
    HealthStatus: "",
    VaccinationStatus: "",
    Availability: "Available",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !petDetails.PetName ||
      !petDetails.PetType ||
      !petDetails.Breed ||
      !petDetails.Age ||
      !petDetails.PetSize ||
      !petDetails.Gender ||
      !petDetails.HealthStatus ||
      !petDetails.VaccinationStatus
    ) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/create-pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(petDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json(); // Expect JSON here
      alert(result.message); // Use the message from the JSON response
      onAddPet(result.pet); // Update the UI with the newly added pet
    } catch (error) {
      console.error("Error adding pet:", error);
      alert(`Failed to add pet: ${error.message}`);
    }
  };

  return (
    <div className="add-pet-form">
      <h2>Add New Pet</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pet Name:</label>
          <input
            type="text"
            name="PetName"
            value={petDetails.PetName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pet Type:</label>
          <input
            type="text"
            name="PetType"
            value={petDetails.PetType}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Breed:</label>
          <input
            type="text"
            name="Breed"
            value={petDetails.Breed}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={petDetails.Age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pet Size:</label>
          <input
            type="text"
            name="PetSize"
            value={petDetails.PetSize}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="Gender"
            value={petDetails.Gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Health Status:</label>
          <input
            type="text"
            name="HealthStatus"
            value={petDetails.HealthStatus}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Vaccination Status:</label>
          <select
            name="VaccinationStatus"
            value={petDetails.VaccinationStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Vaccinated">Vaccinated</option>
            <option value="Not Vaccinated">Not Vaccinated</option>
          </select>
        </div>
        <div>
          <label>Availability:</label>
          <select
            name="Availability"
            value={petDetails.Availability}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

export default AddPetForm;
