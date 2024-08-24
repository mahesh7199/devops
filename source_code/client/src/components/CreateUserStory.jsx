import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '.././App.css';

function CreateUserStory() {
  const [user_story, setUserStory] = useState('');
  const [proj_id, setProjId] = useState('');
  const [priority, setPriority] = useState(0);
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    // Fetch a list of all created projects
    axios.get('http://localhost:9000/getProjects')
      .then(response => {
        setProjectList(response.data); // Assuming that the response contains an array of projects
      })
      .catch(error => {
        console.error('Error fetching project list:', error);
        alert('Error fetching project list. Please try again later.');
      });
  }, []);

  const handleProject = (event) => {
    setProjId(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a POST request to create a user story
    axios.post('http://localhost:9000/addUserStory', { user_story, proj_id, priority })
      .then(response => {
        console.log('User story created:', response.data);
        alert('User story created successfully!');
        // Reset the form
        setUserStory('');
        setProjId('');
        setPriority(0);
      })
      .catch(error => {
        console.error('Error creating user story:', error);
        alert('Error creating user story. Please try again later.');
      });
  };

  return (
    <div>
      <h2>Create User Story</h2><br></br>
      <form onSubmit={handleSubmit}>
        <label>Create User Story:</label>
        <input type="text" value={user_story} onChange={(e) => setUserStory(e.target.value)} />

        <label>Projects:</label>
        <select className='form-select' value={proj_id} onChange={handleProject}>
          <option>select your project</option>
          {projectList.map((proj) => (
            <option key={proj._id} value={proj._id}>
              {proj.project_name}
            </option>
          ))}
        </select>

        <label>Priority:</label>
        <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} /><br></br><br></br>
        <button type="submit">Create User Story</button><br></br>
        <Link to="/ViewUserStories" className="nav-link">View UserStory</Link>
        <span className="link-space"></span>
        <Link to="/AssignUserStories" className="nav-link">Assign UserStories</Link><br />
        <Link to="/home">Go to Home</Link>
      </form>
    </div>
  );
}

export default CreateUserStory;
