import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from 'react-router-dom';

function ViewProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch the projects
    axios.get('http://localhost:9000/getProjects')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch projects:', error);
      });
  }, []);

  return (
    <div>
      <h2>View Projects</h2>
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Project Description</th>
            <th>Product Owner Name</th>
            <th>Project Manager Name</th>
            <th>Team Name</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.project_name}</td>
              <td>{project.description}</td>
              <td>{project.owner_details}</td>
              <td>{project.manager_details}</td>
              <td>{project.teams_details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/CreateProject" className="nav-link">Create Projects</Link>
        <span className="link-space"></span>
        <Link to="/home" className="nav-link">Go to Home</Link><br />
    </div>
  );
}

export default ViewProjects;
