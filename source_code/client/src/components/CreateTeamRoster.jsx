import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '.././App.css';
import { Link } from 'react-router-dom';

function CreateTeamRoster() {
  const [team_id, setTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [teamMembers, setTeamMembers] = useState({});

  useEffect(() => {
    axios.get('http://localhost:9000/getUsers')
      .then((response) => {
        const allUsers = response.data;
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('http://localhost:9000/getTeams')
      .then((response) => {
        setTeams(response.data);

        // Initialize teamMembers with the members of each team
        const initialTeamMembers = {};
        response.data.forEach((team) => {
          initialTeamMembers[team._id] = team.member_ids;
        });
        setTeamMembers(initialTeamMembers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleMembersChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
    setFilteredUsers(users.filter((user) => !selectedOptions.some((selectedUser) => selectedUser.value === user._id)));
  };

  function handleAddMembers() {
    if (team_id && selectedUsers.length > 0) {
      const selectedUserIds = selectedUsers.map((user) => user.value);
      const teamMemberIds = teamMembers[team_id] || [];
  
      // Check if any of the selected users are already in the team
      const duplicates = selectedUserIds.filter((userId) => teamMemberIds.includes(userId));
  
      if (duplicates.length > 0) {
        alert('Selected users are already in the team.');
        return;
      }
  
      // Add selected users to the team if they are not already in it
      const updatedMemberIds = [...teamMemberIds, ...selectedUserIds];
  
      // Update the state to reflect the new team members
      setTeamMembers({
        ...teamMembers,
        [team_id]: updatedMemberIds,
      });
  
      // Send a request to add selected users to the team on the server
      axios.post('http://localhost:9000/addTeamMembers', { team_id, member_ids: selectedUserIds })
        .then((response) => {
          console.log(response.data);
          alert('Team members added successfully');
          setSelectedUsers([]);
          setTeamId('');
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to add team members');
        });
      } else {
        alert('Please select a team and add at least one member.');
      }
  }
  

  return (
    <div>
      
      <h2>Add Team Members to Team Rosters</h2>
      <form>
        <label>Team:</label>
        <select value={team_id} onChange={(e) => setTeamId(e.target.value)}>
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.team_name}
            </option>
          ))}
        </select>
        <br />
        <label>Members:</label>
        <Select
          isMulti
          value={selectedUsers}
          onChange={handleMembersChange}
          options={filteredUsers.map((user) => ({
            label: `${user.firstname} ${user.lastname}`,
            value: user._id,
          }))}
        />
        <br />
        <button type="button" onClick={handleAddMembers}>Add Selected Members</button><br />
        <Link to="/RemoveTeamMembers" className="nav-link">Delete Team Members</Link>
        <span className="link-space"></span>
        <Link to="/TeamRosterList" className="nav-link">View Team Rosters</Link><br />
        <Link to="/home">Go to Home</Link>
      </form>
    </div>
  );
}

export default CreateTeamRoster;
