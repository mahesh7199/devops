import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CreateTasks = () => {
  const [assignedUserStories, setAssignedUserStories] = useState([]);
  const [selectedUserStory, setSelectedUserStory] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('New');
  const loggedInUser = localStorage.getItem('username') || ''; // Ensure it's a string

  useEffect(() => {
    const fetchAssignedUserStories = async () => {
      try {
        const response = await axios.get('http://localhost:9000/getAssignedStories');
        console.log('API Response:', response.data);

        // Log the loggedInUser value
        console.log('Logged-in User:', loggedInUser);

        // Log the selectedUserStory value
        console.log('Selected User Story:', selectedUserStory);

        // Filter and map user stories correctly
        const stories = response.data
          .filter((story) => {
            return story.user_id.username === loggedInUser;
          })
          .map((story) => ({
            _id: story.user_story_id._id,
            user_story: story.user_story_id.user_story,
          }));

        console.log('Filtered Stories:', stories);
        setAssignedUserStories(stories);
      } catch (error) {
        console.error('Error fetching assigned stories:', error);
      }
    };

    fetchAssignedUserStories();
  }, [loggedInUser, selectedUserStory]);


  const fetchUserId = async (username) => {
    try {
      const response = await axios.get(`http://localhost:9000/getUserId?username=${username}`);
      return response.data.userId;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const userId = await fetchUserId(loggedInUser); // Fetch the user's ObjectId
  
    if (!userId) {
      alert('Failed to fetch user ID');
      return;
    }
  
    const taskDetails = {
      taskDescription: taskDescription, // Ensure this is the correct field name
      userStoryId: selectedUserStory,
      status: taskStatus,
      createdBy: userId,
    };
  
    console.log("Sending task details:", taskDetails); // Log to check the payload
  
    try {
      await axios.post('http://localhost:9000/createTask', taskDetails);
      alert('Task created successfully');
      setSelectedUserStory('');
      setTaskDescription('');
      setTaskStatus('New');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleCreateTask}>
        <label>User Story:</label>
        <select
          value={selectedUserStory}
          onChange={(e) => setSelectedUserStory(e.target.value)}
        >
          <option value="">Select a User Story</option>
          {assignedUserStories.map((story) => (
            <option key={story._id} value={story._id}>
              {story.user_story}
            </option>
          ))}
        </select>
        <br />

        <label>Task Description:</label>
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <br />

        <label>Status:</label>
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Awaiting Confirmation">Awaiting Confirmation</option>
          <option value="Completed">Completed</option>
        </select>
        <br />

        <button type="submit">Create Task</button>
        <br />

        <Link to="/CreateUserStory" className="nav-link">
          Create User Stories
        </Link>
        <span className="link-space"></span>
        <Link to="/ViewTask" className="nav-link">
          View Tasks
        </Link>
        <br />
        <Link to="/home">Go to Home</Link>
      </form>
    </div>
  );
};

export default CreateTasks;
