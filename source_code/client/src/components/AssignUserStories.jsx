import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AssignUserStories = () => {
    const [unassignedUserStories, setUnassignedUserStories] = useState([]);
    const [assignedUserStories, setAssignedUserStories] = useState([]);
    const loggedInUser = localStorage.getItem('username');

    const fetchUserId = async (username) => {
        try {
            const response = await axios.get(`http://localhost:9000/getUserId`, { params: { username } });
            return response.data.userId;
        } catch (error) {
            console.error("Error fetching user ID:", error);
            return null;
        }
    };
    const fetchUserStories = useCallback(async () => {
        try {
            const userId = await fetchUserId(loggedInUser);
            if (!userId) {
                console.error("User ID not found for the username:", loggedInUser);
                return;
            }
    
            const [teamRostersRes, projectsRes, userStoriesRes] = await Promise.all([
                axios.get('http://localhost:9000/getTeamRosters'),
                axios.get('http://localhost:9000/getProjects'),
                axios.get('http://localhost:9000/getAllUserStories')
            ]);
    
            const myTeamsIds = teamRostersRes.data
                .filter(teamRoster => teamRoster.member_id.includes(userId))
                .map(teamRoster => teamRoster.team_id);
    
            const myProjectsIds = projectsRes.data
                .filter(project => myTeamsIds.includes(project.team_id))
                .map(project => project._id);
    
            const assignedStoriesRes = await axios.get('http://localhost:9000/getAssignedStories');
            const assigned = assignedStoriesRes.data.map(assignment => ({
                ...assignment.user_story_id,
                assignedTo: assignment.user_id ? `${assignment.user_id.firstname} ${assignment.user_id.lastname}` 
                : 'Not Available'
            }));
    
            // Filter the unassigned stories to exclude assigned ones
            const unassigned = userStoriesRes.data
                .filter(userStory => myProjectsIds.includes(userStory.proj_id) && !userStory.isAssigned && 
                        !assigned.some(story => story._id === userStory._id));
    
            setUnassignedUserStories(unassigned);
            setAssignedUserStories(assigned);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [loggedInUser]);
    

    useEffect(() => {
        fetchUserStories();
    }, [fetchUserStories]);


   const onClickAssign = async (userStoryId) => {
    try {
        // Fetch user ID based on the username (loggedInUser)
        const response = await axios.get(`http://localhost:9000/getUserId`, { params: { username: loggedInUser } });
        const userId = response.data.userId;

        if (!userId) {
            console.error("User ID not found for the username:", loggedInUser);
            return;
        }

        await axios.post('http://localhost:9000/assignStory', {
            user_story_id: userStoryId,
            user_id: userId // Use the fetched user ID here
        });

        fetchUserStories();
        alert('User Story assigned successfully');
    } catch (err) {
        console.error("Error in assigning story:", err.response ? err.response.data : err);
    }
};

    return (
        <div>
            <h2>Assign User Stories</h2>
            <table>
                <thead>
                    <tr>
                        <th>User Story</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {unassignedUserStories.length > 0 ? (
                        unassignedUserStories.map(story => (
                            <tr key={story._id}>
                                <td>{story.user_story}</td>
                                <td>
                                    <button onClick={() => onClickAssign(story._id)}>Assign to Me</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="2">No unassigned user stories</td></tr>
                    )}
                </tbody>
            </table>

            <h2>Assigned User Stories</h2>
            <table>
                <thead>
                    <tr>
                        <th>User Story</th>
                        <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedUserStories.length > 0 ? (
                        assignedUserStories.map(story => (
                            <tr key={story._id}>
                                <td>{story.user_story}</td>
                                <td>{story.assignedTo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="2">No assigned user stories</td></tr>
                    )}
                </tbody>
            </table>

            <Link to="/CreateUserStory" className="nav-link">Create UserStories</Link>
            <span className="link-space"></span>
            <Link to="/home">Go to Home</Link>
        </div>
    );
};

export default AssignUserStories;
