import React, { useState } from "react";
import AddPetForm from "./AddPetForm";

const AdminPanel = () => {
  const [pets, setPets] = useState([]);

  const handleAddPet = (newPet) => {
    // Make sure newPet is not undefined and contains the expected properties
    if (newPet) {
      setPets((prevPets) => [...prevPets, newPet]);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <AddPetForm onAddPet={handleAddPet} />
      <h2>Pets List</h2>
      <ul>
        {pets.map((pet, index) => (
          // Add a check for undefined pet
          pet ? (
            <li key={pet.PetID || index}>
              {`PetName: ${pet.PetName}, PetSize: ${pet.PetSize}, Breed: ${pet.Breed}, PetType: ${pet.PetType}, Age: ${pet.Age}, Gender: ${pet.Gender}, Health: ${pet.HealthStatus}, Vaccination: ${pet.VaccinationStatus}, Status: ${pet.Availability}`}
            </li>
          ) : (
            <li key={index}>Invalid Pet Data</li> // Show a fallback if pet is undefined
          )
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
