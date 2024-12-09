import React, { useState, useEffect } from "react";// Assuming you have a separate CSS file for styling

const AdminPanel = () => {
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const [selectedRequests, setSelectedRequests] = useState([]);

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

    fetchAdoptionRequests();
  }, []);

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
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {error && <p className="error">{error}</p>}

      <div className="controls">
        <label htmlFor="filterStatus">Filter by Status:</label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={() => handleBulkUpdateStatus("Approved")}
          disabled={selectedRequests.length === 0}
        >
          Approve Selected
        </button>
        <button
          onClick={() => handleBulkUpdateStatus("Rejected")}
          disabled={selectedRequests.length === 0}
        >
          Reject Selected
        </button>
      </div>

      {currentRequests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Request ID</th>
              <th>Request Date</th>
              <th>User ID</th>
              <th>Pet ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request.RequestID}>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectRequest(request.RequestID, e.target.checked)
                    }
                  />
                </td>
                <td>{request.RequestID}</td>
                <td>{request.RequestDate}</td>
                <td>{request.UserID}</td>
                <td>{request.PetID}</td>
                <td>{request.Status}</td>
                <td>
                  <button
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
        <p>No adoption requests available.</p>
      )}

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
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
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPanel2;