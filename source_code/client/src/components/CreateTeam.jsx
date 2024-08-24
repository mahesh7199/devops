import React, { useState } from 'react';
import '.././App.css';
import { Link } from "react-router-dom";
import axios from 'axios';

function CreateTeam() {
  const [Team_name, setTeamName] = useState('');
  function handleSubmit(e) {
    e.preventDefault();

    if (!Team_name) {
      alert('Team Name is required');
      return;
    }

    const teamDetails = {
      team_name: Team_name,
    };
 
 axios
 .post('http://localhost:9000/createTeam', teamDetails)
 .then((res) => {
   console.log(res);
   if (res.status === 201) {
     alert('Team created successfully');
     // Optionally, you can reset the form after successful submission
     setTeamName('');
   } else {
     alert('Error in creating the team');
   }
 })
 .catch((err) => {
   console.error(err);
   alert('Error in creating the team');
 });
}
  return (
    <div>
      
      <h2>Team Name</h2><br></br>
      <form onSubmit={handleSubmit}>
        <label>Team Name:</label>
        <input type="text" value={Team_name} onChange={(e) => setTeamName(e.target.value)} /><br></br>
        <button type="submit">Create Team</button><br></br>
        <Link to="/ViewTeam" className="nav-link">View Teams</Link>
        <span className="link-space"></span>
        <Link to="/home" className="nav-link">Go to Home</Link><br />
      </form>
    </div>
  );
}


export default CreateTeam;
