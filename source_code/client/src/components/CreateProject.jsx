import React, { useState, useEffect } from 'react';
import '.././App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CreateProject() {
  const [proj_name, setProjName] = useState('');
  const [proj_desc, setProjDesc] = useState('');
  const [prod_owner_id, setProdOwnerId] = useState('');
  const [mgr_id, setMgrId] = useState('');
  const [team_id, setTeamId] = useState('');
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);

  // Fetch users and teams data from the server
  useEffect(() => {
    // Fetch users
    axios.get('http://localhost:9000/getUsers')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch teams
    axios.get('http://localhost:9000/getTeams')
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    // Find the selected user and team based on their IDs
    const selectedManager = users.find((user) => user._id === mgr_id);
    const selectedOwner = users.find((user) => user._id === prod_owner_id);
    const selectedTeam = teams.find((team) => team._id === team_id);

    const projectDetails = {
      proj_name: proj_name,
      proj_desc: proj_desc,
      mgr_id: selectedManager ? selectedManager._id : null,
      prod_owner_id: selectedOwner ? selectedOwner._id : null,
      team_id: selectedTeam ? selectedTeam._id : null,
    };

    axios
      .post('http://localhost:9000/createProject', projectDetails)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          alert('Project created successfully');
          // Optionally, you can reset the form after successful submission
          setProjName('');
          setProjDesc('');
          setProdOwnerId('');
          setMgrId('');
          setTeamId('');
        } else {
          alert('Error in creating the project');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Error in creating the project');
      });
  }

  return (
    <div>
      <h2>Create Project</h2><br></br>
      <form onSubmit={handleSubmit}>
        <label>Project Name:</label>
        <input type="text" value={proj_name} onChange={(e) => setProjName(e.target.value)} /><br></br>

        <label>Project Description:</label>
        <input type="text" value={proj_desc} onChange={(e) => setProjDesc(e.target.value)} /><br></br>

        <label>Product Owner:</label>
        <select value={prod_owner_id} onChange={(e) => setProdOwnerId(e.target.value)}>
          <option value="">Select Product Owner</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select><br></br>

        <label>Manager:</label>
        <select value={mgr_id} onChange={(e) => setMgrId(e.target.value)}>
          <option value="">Select Manager</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select><br></br>

        <label>Team:</label>
        <select value={team_id} onChange={(e) => setTeamId(e.target.value)}>
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.team_name}
            </option>
          ))}
        </select><br></br>

        <button type="submit">Create Project</button><br></br>

        <Link to="/CreateTeam" className="nav-link">Create Team </Link>
        <span className="link-space"></span>
        <Link to="/ViewProjects" className="nav-link">View Projects</Link><br />
        <Link to="/home">Go to Home</Link>
      </form>
    </div>
  );
}

export default CreateProject;
