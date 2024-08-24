import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure this path matches your CSS file's location

function Home() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear user data
        navigate('/'); // Redirect to login page
    };

    // Retrieve username from localStorage
    const username = localStorage.getItem('username');
    console.log("Username from localStorage:", username);

    return (
        <div className="container">
            {username && (
                <div className="username-display">Welcome, {username}</div>
            )}
            {username && (
                <button onClick={handleLogout} className="logout-button">Logout</button>
            )}
            <h2>Welcome to the ICSI-518</h2>
            <br />
            <div>
                <button onClick={() => handleNavigation('/CreateProject')}>Create Project</button>
                <button onClick={() => handleNavigation('/CreateTeam')}>Create Team</button>
                <button onClick={() => handleNavigation('/CreateTeamRoster')}>Create TeamRoster</button>
                <button onClick={() => handleNavigation('/CreateUserStory')}>Create User Stories</button>
                <button onClick={() => handleNavigation('/CreateTask')}>Create Task</button>
                <button onClick={() => handleNavigation('/ViewTeam')}>Team List</button>
                <button onClick={() => handleNavigation('/ViewProjects')}>Project List</button>
                <button onClick={() => handleNavigation('/ViewUserStories')}>User Stories List</button>
                <button onClick={() => handleNavigation('/TeamRosterlist')}>Team Rosters List</button>
                <button onClick={() => handleNavigation('/RemoveTeamMembers')}>Remove Team Members</button>
                <button onClick={() => handleNavigation('/AssignUserStories')}>Assign User Stories</button>
                <button onClick={() => handleNavigation('/ViewTask')}>Tasks List</button>
            </div>
        </div>
    );
}

export default Home;
