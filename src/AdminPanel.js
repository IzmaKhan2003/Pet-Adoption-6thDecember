import React, { useState, useEffect } from "react";
import AddPetForm from "./AddPetForm";

const AdminPanel = () => {
  const [pets, setPets] = useState([]);
  const [editPet, setEditPet] = useState(null); // State for the pet being edited
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [users, setUsers] = useState([]); // State for users
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const parseArrayToObjects = (data) => {
    const keys = [
      "PetID",
      "PetName",
      "PetType",
      "Breed",
      "Age",
      "PetSize",
      "Gender",
      "HealthStatus",
      "VaccinationStatus",
      "Availability",
    ];

    return data.map((item) => {
      const obj = {};
      keys.forEach((key, index) => {
        obj[key] = item[index];
      });
      return obj;
    });
  };




  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pets");
      if (!response.ok) {
        throw new Error(`Failed to fetch pets: ${response.status}`);
      }
      const data = await response.json();
      const parsedData = parseArrayToObjects(data);
      setPets(parsedData);
    } catch (error) {
      console.error("Error fetching pets:", error);
      alert("Failed to fetch pets. Please check the server.");
    }
  };

  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/adoption-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch adoption requests");
        }

        const data = await response.json();

        const formattedRequests = data.map((request) => ({
          RequestID: request[0],
          RequestDate: new Date(request[1]).toLocaleString(),
          UserID: request[2],
          PetID: request[3],
          Status: request[4],
        }));

        setAdoptionRequests(formattedRequests);
      } catch (err) {
        console.error("Error fetching adoption requests:", err);
        setError("Unable to load adoption requests. Please try again later.");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
  
        const data = await response.json(); // Assuming data is an array of arrays
        console.log("Fetched Data:", data);
  
        // Map the user data to a structured format, removing unnecessary fields
        const formattedUsers = data.map((userArray) => ({
          UserID: userArray[0], // Assuming user ID is the first element
          UserName: userArray[1], // Assuming username is the second element
          Email: userArray[2], // Assuming email is the third element
        }));
  
        console.log("Formatted Users:", formattedUsers);
  
        // Set the formatted users to state
        setUsers(formattedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Unable to load users. Please try again later.");
      }
    };
  
    fetchUsers();

    fetchAdoptionRequests();
    fetchPets();
  }, []);

  const handleAddPet = (newPet) => {
    if (newPet) {
      setPets((prevPets) => [...prevPets, newPet]);
    }
  };

  const handleUpdatePet = async (updatedPet) => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Check if token exists
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        return;
      }
  
      console.log("Token:", token); // Debugging step
  
      const response = await fetch(`http://localhost:5000/api/pets/${updatedPet.PetID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach the token here
        },
        body: JSON.stringify(updatedPet),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Parse non-JSON responses
        console.error(`Error response from server: ${errorText}`);
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
  
      alert("Pet updated successfully!");
      setEditPet(null); // Close the edit form
      fetchPets(); // Refresh the pet list
    } catch (error) {
      console.error("Error updating pet:", error);
      alert("Failed to update pet. Please try again.");
    }
  };
  

 const handleDeletePet = async (petId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
  if (!confirmDelete) return;

  // Get the token from localStorage, cookies, or wherever it's stored
  const token = localStorage.getItem("authToken"); // Example

  try {
    const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,  // Include token in the Authorization header
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.text(); // Response might not be JSON
      throw new Error(`Failed to delete pet: ${response.status} - ${errorData}`);
    }

    // Update the state after successful deletion
    setPets((prevPets) => prevPets.filter((pet) => pet.PetID !== petId));
    alert("Pet deleted successfully!");
  } catch (error) {
    console.error("Error deleting pet:", error);
    alert("Failed to delete pet. Please check your authorization.");
  }
};


const handleCreateUser = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ Name: newUserName, Email: newUserEmail, "Password": "SecurePass123",
        Phone: "123456789",
        Address: "Springfield",
        UserType: "Admin" }),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const createdUser = await response.json();
    setUsers((prevUsers) => [...prevUsers, createdUser]);
    alert("User created successfully!");
    setNewUserName("");
    setNewUserEmail("");
    setNewUserModal(false);
  } catch (err) {
    console.error("Error creating user:", err);
    alert("Unable to create user. Please try again.");
  }
};


  const handleUpdateRequestStatus = async (requestId, userId, petId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/adoption-request/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ UserID: userId, PetID: petId, status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      alert(`Request status updated to "${newStatus}" successfully.`);
      setAdoptionRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.RequestID === requestId ? { ...req, Status: newStatus } : req
        )
      );
    } catch (err) {
      console.error("Error updating request status:", err);
      alert("Unable to update request status. Please try again.");
    }
  };

  const handleSelectRequest = (requestId, isSelected) => {
    setSelectedRequests((prev) =>
      isSelected ? [...prev, requestId] : prev.filter((id) => id !== requestId)
    );
  };

  const handleBulkUpdateStatus = async (newStatus) => {
    try {
      await Promise.all(
        selectedRequests.map((requestId) =>
          fetch(`http://localhost:5000/api/adoption-requests/${requestId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({ status: newStatus }),
          })
        )
      );

      alert(`Selected requests updated to "${newStatus}" successfully.`);
      setAdoptionRequests((prev) =>
        prev.map((req) =>
          selectedRequests.includes(req.RequestID)
            ? { ...req, Status: newStatus }
            : req
        )
      );
      setSelectedRequests([]);
    } catch (err) {
      console.error("Error updating request statuses:", err);
      alert("Unable to update selected requests. Please try again.");
    }
  };

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const filteredRequests =
    filterStatus === "All"
      ? adoptionRequests
      : adoptionRequests.filter((request) => request.Status === filterStatus);
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);


  return (
    <div className="admin-panel"
      style={{
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
    Admin Panel
  </h1>
  <div>
  <AddPetForm onAddPet={handleAddPet} />
  
  {editPet && (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          background: "#f9f9f9",
          borderRadius: "10px",
          padding: "20px 30px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#333",
            textAlign: "center",
          }}
        >
          Edit Pet
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePet(editPet);
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Pet Name:
            </label>
            <input
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              type="text"
              value={editPet.PetName}
              onChange={(e) =>
                setEditPet({ ...editPet, PetName: e.target.value })
              }
              placeholder="Enter pet name"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Pet Type:
            </label>
            <input
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              type="text"
              value={editPet.PetType}
              onChange={(e) =>
                setEditPet({ ...editPet, PetType: e.target.value })
              }
              placeholder="Enter pet type (e.g., Dog, Cat)"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Breed:
            </label>
            <input
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              type="text"
              value={editPet.Breed}
              onChange={(e) =>
                setEditPet({ ...editPet, Breed: e.target.value })
              }
              placeholder="Enter breed"
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#555",
                marginBottom: "5px",
              }}
            >
              Age:
            </label>
            <input
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              type="number"
              value={editPet.Age}
              onChange={(e) =>
                setEditPet({ ...editPet, Age: e.target.value })
              }
              placeholder="Enter pet age"
            />
          </div>
          {/* Add fields for other attributes similarly */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                color: "#fff",
                backgroundColor: "#007BFF",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditPet(null)}
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                color: "#fff",
                backgroundColor: "#6c757d",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

   <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#333', marginBottom: '20px' }}>Pets List</h2>
      
      {/* Filter and Bulk Actions Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
        <label htmlFor="filterStatus" style={{ fontSize: '1rem', color: '#555' }}>
          Filter by Status:
        </label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
        </select>

        <button
          onClick={() => handleBulkUpdateStatus("Approved")}
          disabled={selectedRequests.length === 0}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            opacity: selectedRequests.length === 0 ? 0.5 : 1
          }}
        >
          Approve Selected
        </button>
        <button
          onClick={() => handleBulkUpdateStatus("Rejected")}
          disabled={selectedRequests.length === 0}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            opacity: selectedRequests.length === 0 ? 0.5 : 1
          }}
        >
          Reject Selected
        </button>
      </div>

      {/* Table Displaying Pet List */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f1f1', color: '#333' }}>
            <th>#</th>
            <th>Pet Name</th>
            <th>Pet Size</th>
            <th>Breed</th>
            <th>Pet Type</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Health Status</th>
            <th>Vaccination Status</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet, index) => (
            <tr key={pet.PetID} style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd', transition: 'background-color 0.3s' }}>
              <td>{index + 1}</td>
              <td>{pet.PetName}</td>
              <td>{pet.PetSize}</td>
              <td>{pet.Breed}</td>
              <td>{pet.PetType}</td>
              <td>{pet.Age}</td>
              <td>{pet.Gender}</td>
              <td>{pet.HealthStatus}</td>
              <td>{pet.VaccinationStatus}</td>
              <td>{pet.Availability}</td>
              <td style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setEditPet(pet)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePet(pet.PetID)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                >
                  Delete
                </button>
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(pet.PetID)}
                  onChange={() => handleSelectPet(pet.PetID)}
                  style={{ width: '20px', height: '20px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      <div
  className="admin-panel"
  style={{
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
    Admin Panel
  </h1>

  {error && (
    <p
      className="error"
      style={{
        color: "#ff4d4d",
        backgroundColor: "#ffe6e6",
        padding: "10px",
        borderRadius: "5px",
        textAlign: "center",
        marginBottom: "20px",
      }}
    >
      {error}
    </p>
  )}

  <div
    className="controls"
    style={{
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginBottom: "20px",
      flexWrap: "wrap",
    }}
  >
    <label htmlFor="filterStatus" style={{ fontWeight: "bold" }}>
      Filter by Status:
    </label>
    <select
      id="filterStatus"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      style={{
        padding: "5px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Approved">Approved</option>
      <option value="Rejected">Rejected</option>
    </select>

    <button
      onClick={() => handleBulkUpdateStatus("Approved")}
      disabled={selectedRequests.length === 0}
      style={{
        padding: "5px 15px",
        backgroundColor: selectedRequests.length > 0 ? "#4CAF50" : "#ccc",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: selectedRequests.length > 0 ? "pointer" : "not-allowed",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      Approve Selected
    </button>
    <button
      onClick={() => handleBulkUpdateStatus("Rejected")}
      disabled={selectedRequests.length === 0}
      style={{
        padding: "5px 15px",
        backgroundColor: selectedRequests.length > 0 ? "#ff4d4d" : "#ccc",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: selectedRequests.length > 0 ? "pointer" : "not-allowed",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      Reject Selected
    </button>
  </div>

  {currentRequests.length > 0 ? (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Select</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>
            Request ID
          </th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>
            Request Date
          </th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>User ID</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Pet ID</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentRequests.map((request, index) => (
          <tr
            key={request.RequestID}
            style={{
              backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
            }}
          >
            <td
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "center",
              }}
            >
              <input
                type="checkbox"
                onChange={(e) =>
                  handleSelectRequest(request.RequestID, e.target.checked)
                }
              />
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {request.RequestID}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {request.RequestDate}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {request.UserID}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {request.PetID}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {request.Status}
            </td>
            <td
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "center",
              }}
            >
              <button
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() =>
                  handleUpdateRequestStatus(
                    request.RequestID,
                    request.UserID,
                    request.PetID,
                    "Approved"
                  )
                }
              >
                Update to Approved
              </button>
              <button
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
                onClick={() =>
                  handleUpdateRequestStatus(
                    request.RequestID,
                    request.UserID,
                    request.PetID,
                    "Rejected"
                  )
                }
              >
                Update to Rejected
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={{ textAlign: "center", color: "#999" }}>
      No adoption requests available.
    </p>
  )}

  <div
    className="pagination"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "20px",
    }}
  >
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      style={{
        padding: "5px 15px",
        backgroundColor: currentPage === 1 ? "#ccc" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: currentPage === 1 ? "not-allowed" : "pointer",
      }}
    >
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
      }
      disabled={currentPage === totalPages}
      style={{
        padding: "5px 15px",
        backgroundColor: currentPage === totalPages ? "#ccc" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
      }}
    >
      Next
    </button>
  </div>
 

  
<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
  }}
>
  <button
    onClick={() => setNewUserModal(true)}
    style={{
      padding: "15px 30px",
      fontSize: "18px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    Create User
  </button>
</div>

{/* Enlarged and Enhanced Create User Modal */}
{newUserModal && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "50%", // Adjust modal width
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      zIndex: 1000, // Ensure it's above other content
    }}
  >
    <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Create New User</h2>
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "10px" }}>Username:</label>
      <input
        type="text"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </div>
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "10px" }}>Email:</label>
      <input
        type="email"
        value={newUserEmail}
        onChange={(e) => setNewUserEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
    </div>
    <div style={{ textAlign: "center" }}>
      <button
        onClick={handleCreateUser}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        Create
      </button>
      <button
        onClick={() => setNewUserModal(false)}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

       

     {/* New: Users Section */}
<div
  className="users-section"
  style={{
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
    Users
  </h2>
  {users.length > 0 ? (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>User ID</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Username</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr
            key={user.UserID}
            style={{
              backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white",
            }}
          >
            <td
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "center",
              }}
            >
              {user.UserID}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {user.UserName}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
              {user.Email}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={{ textAlign: "center", color: "#999" }}>No users available.</p>
  )}
</div>


</div>
</div>

    
  );
};

export default AdminPanel;
