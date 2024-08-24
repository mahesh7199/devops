import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '.././App.css';
import { Link } from 'react-router-dom';

function TeamList() {
  const [teamNames, setTeamNames] = useState([]);

  useEffect(() => {
    // Fetch team names from the server
    axios.get('http://localhost:9000/getTeams')
      .then((response) => {
        setTeamNames(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Team Names</h2>
      <ul>
        {teamNames.map((team, index) => (
          <li key={index}>{team.team_name}</li>
        ))}
      </ul>
      <Link to="/CreateTeam" className="nav-link">Create Teams</Link>
        <span className="link-space"></span>
        <Link to="/home" className="nav-link">Go to Home</Link><br />
    </div>
  );
}

export default TeamList;


