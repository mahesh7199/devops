import React, { useState, useEffect } from 'react';
import '.././App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function TeamRosterList() {
  const [teamRosters, setTeamRosters] = useState([]);
  const [memberNames, setMemberNames] = useState({});
  const [teamNames, setTeamNames] = useState({});

  useEffect(() => {
    // Fetch team rosters
    axios.get('http://localhost:9000/getTeamRosters')
      .then((response) => {
        setTeamRosters(response.data);
        const memberIds = response.data.flatMap((roster) => roster.member_id);
        const teamIds = response.data.map((roster) => roster.team_id);
        fetchMemberNames(memberIds);
        fetchTeamNames(teamIds);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Function to fetch member names
  const fetchMemberNames = (memberIds) => {
    axios.get('http://localhost:9000/getUsers')
      .then((response) => {
        const names = {};
        response.data.forEach((member) => {
          if (memberIds.includes(member._id)) {
            names[member._id] = `${member.firstname} ${member.lastname}`;
          }
        });
        setMemberNames(names);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to fetch team names
  const fetchTeamNames = (teamIds) => {
    axios.get('http://localhost:9000/getTeams')
      .then((response) => {
        const names = {};
        response.data.forEach((team) => {
          if (teamIds.includes(team._id)) {
            names[team._id] = team.team_name;
          }
        });
        setTeamNames(names);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
    <h2>Team Rosters</h2>
    <table className="team-roster-table"> {/* Apply the CSS class to the table */}
      <thead>
        <tr>
          <th>Team</th>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        {teamRosters.map((roster) => (
          <tr key={roster._id}>
            <td>{teamNames[roster.team_id]}</td>
            <td>
              {roster.member_id.map((memberId) => memberNames[memberId]).join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
                <Link to="/CreateTeamRoster" className="nav-link">Add Team Members</Link>
                <span className="link-space"></span>
                <Link to="/RemoveTeamMembers" className="nav-link">Delete Team Members</Link><br></br>
                <Link to="/home">Go to Home</Link>
  </div>
  );
}

export default TeamRosterList;
