import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '.././App.css';

function ViewUserStories() {
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [userStories, setUserStories] = useState([]);
  const [showAllUserStories, setShowAllUserStories] = useState(false);

  useEffect(() => {
    // Fetch a list of all created projects
    axios.get('http://localhost:9000/getProjects')
      .then(response => {
        setProjectList(response.data);
      })
      .catch(error => {
        console.error('Error fetching project list:', error);
      });
  }, []);

  const handleProjectSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue);
    setShowAllUserStories(selectedValue === 'all'); // Check if "All User Stories" is selected
  };

  useEffect(() => {
    // Fetch user stories when a project is selected
    if (selectedProject && !showAllUserStories) {
      axios.get(`http://localhost:9000/getUserStories/${selectedProject}`)
        .then(response => {
          setUserStories(response.data);
        })
        .catch(error => {
          console.error('Error fetching user stories:', error);
        });
    } else if (showAllUserStories) {
      // Fetch all user stories if "All User Stories" is selected
      axios.get('http://localhost:9000/getAllUserStories')
        .then(response => {
          setUserStories(response.data);
        })
        .catch(error => {
          console.error('Error fetching user stories:', error);
        });
    }
  }, [selectedProject, showAllUserStories]);

  const handleDeleteUserStory = (storyId) => {
    // Implement the code to delete the user story by sending a DELETE request
    axios.delete(`http://localhost:9000/deleteUserStory/${storyId}`)
      .then(response => {
        // Remove the deleted user story from the userStories state
        setUserStories(userStories.filter(story => story._id !== storyId));
      })
      .catch(error => {
        console.error('Error deleting user story:', error);
      });
  };

  return (
    <div className="container">
      <h2>View User Stories</h2><br></br>

      <section className="project-selection">
        <label>Select a Project:</label>
        <select value={selectedProject} onChange={handleProjectSelect}>
          <option value="">Select a project</option>
          <option value="all">All User Stories</option> {/* Add "All User Stories" option */}
          {projectList.map((proj) => (
            <option key={proj._id} value={proj._id}>
              {proj.project_name}
            </option>
          ))}
        </select><br></br>
        <Link to="/CreateUserStory" className="nav-link">Create UserStory</Link>
        <span className="link-space"></span>
        <Link to="/AssignUserStories" className="nav-link">Assign User Stories</Link><br />
        <Link to="/home">Go to Home</Link>

      </section>

      {selectedProject && (
        <section className="user-stories">
          <h3>User Stories for {selectedProject === 'all' ? 'All Projects' : projectList.find(proj => proj._id === selectedProject).project_name}</h3>
          <table className="project-table">
            <thead>
              <tr>
                <th>User Story</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userStories.map((story) => (
                <tr key={story._id}>
                  <td>{story.user_story}</td>
                  <td>{story.priority}</td>
                  <td>
                    <button onClick={() => handleDeleteUserStory(story._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      
    </div>
  );
}

export default ViewUserStories;
