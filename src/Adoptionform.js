// import React, { useState } from "react";
// import { TextField, Button, Typography } from "@mui/material";

// function AdoptionForm({ petId, onSubmit, onClose }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const requestPayload = {
//       email: formData.email,
//       petId,
//       comments: formData.message,
//     };

//     try {
//       const response = await fetch("/api/adoption-requests", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestPayload),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Failed to submit adoption request");
//       }

//       const result = await response.json();
//       console.log("Adoption request submitted:", result);
//       onSubmit(result);
//     } catch (err) {
//       console.error("Error submitting adoption request:", err);
//     }

//     setFormData({ name: "", email: "", message: "" });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <Typography variant="h6" gutterBottom>
//         Adoption Request Form
//       </Typography>
//       <TextField
//         label="Your Name"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         fullWidth
//         required
//         margin="normal"
//       />
//       <TextField
//         label="Your Email"
//         name="email"
//         type="email"
//         value={formData.email}
//         onChange={handleChange}
//         fullWidth
//         required
//         margin="normal"
//       />
//       <TextField
//         label="Message (Optional)"
//         name="message"
//         value={formData.message}
//         onChange={handleChange}
//         fullWidth
//         multiline
//         rows={3}
//         margin="normal"
//       />
//       <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
//         <Button variant="contained" color="primary" type="submit">
//           Submit
//         </Button>
//         <Button variant="outlined" color="secondary" onClick={onClose}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   );
// }

// export default AdoptionForm;
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

function AdoptionForm({ onSubmit, onClose }) {
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit({ email, comments }); // Pass email and comments to the parent component
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Comments"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        multiline
        rows={4}
        required
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default AdoptionForm;
