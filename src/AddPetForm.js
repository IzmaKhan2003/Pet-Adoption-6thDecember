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
      setIsLoading(true);
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

      const result = await response.json();
      alert(result.message);
      onAddPet(result.pet);
    } catch (error) {
      console.error("Error adding pet:", error);
      alert(`Failed to add pet: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Pet</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Pet Name:</label>
          <input
            type="text"
            name="PetName"
            value={petDetails.PetName}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter pet name"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Pet Type:</label>
          <input
            type="text"
            name="PetType"
            value={petDetails.PetType}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter pet type"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Breed:</label>
          <input
            type="text"
            name="Breed"
            value={petDetails.Breed}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter breed"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Age:</label>
          <input
            type="number"
            name="Age"
            value={petDetails.Age}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter age"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Pet Size:</label>
          <input
            type="text"
            name="PetSize"
            value={petDetails.PetSize}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter pet size"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Gender:</label>
          <select
            name="Gender"
            value={petDetails.Gender}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Health Status:</label>
          <input
            type="text"
            name="HealthStatus"
            value={petDetails.HealthStatus}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter health status"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Vaccination Status:</label>
          <select
            name="VaccinationStatus"
            value={petDetails.VaccinationStatus}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select Vaccination Status</option>
            <option value="Vaccinated">Vaccinated</option>
            <option value="Not Vaccinated">Not Vaccinated</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Availability:</label>
          <select
            name="Availability"
            value={petDetails.Availability}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="Available">Available</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={isLoading ? styles.loadingButton : styles.submitButton}
        >
          {isLoading ? "Adding..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#f0f4f8",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  loadingButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#6c757d",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
  },
};

export default AddPetForm;
