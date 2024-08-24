import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function DeleteTeamMembers() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedMembersToDelete, setSelectedMembersToDelete] = useState([]);

    async function fetchFullTeams() {
        try {
            const response = await axios.get('http://localhost:9000/getTeamsRoaster');
            setTeams(response.data);
        } catch (error) {
            console.error("Error fetching teams", error);
        }
    }

    useEffect(() => {
        fetchFullTeams();
    }, []);

    const handleTeamSelect = (e) => {
        const teamId = e.target.value;
        const team = teams.find(t => t.team_id === teamId);
        setSelectedTeam(team);
    }

    const handleMemberSelect = (userId) => {
        setSelectedMembersToDelete(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    }

    const handleDelete = async () => {
        try {
            await axios.post('http://localhost:9000/removeTeamMembers', {
                team_id: selectedTeam.team_id,
                membersToDelete: selectedMembersToDelete
            });

            setSelectedMembersToDelete([]);
            alert("Team members updated successfully!");
            fetchFullTeams();
            setSelectedMembersToDelete([])
            setSelectedTeam(null);

        } catch (error) {
            console.error("Error updating team members", error);
            alert("Failed to update team members!");
        }
    }

    return (
        <div className="container mt-4">
            <div className="card mx-4 mx-md-5 shadow-5-strong">
                <div className="card-body py-3 px-md-3">
                    <h2 className="mb-3 text-center">Delete Team Members</h2>
                    <div className="form-group">
                        <label>Select a team:</label>
                        <select className="form-control" onChange={handleTeamSelect}>
                            <option value="">-- Select a team --</option>
                            {teams.map(team => (
                                <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedTeam && (
                        <div>
                            <h3 className="mt-4">Team Members:</h3>
                            <ul className="list-group mt-3">
                                {selectedTeam.users.map(user => (
                                    <li key={user.id} className="list-group-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembersToDelete.includes(user.id)}
                                            onChange={() => handleMemberSelect(user.id)}
                                        />
                                        {' '}
                                        {user.name}
                                    </li>
                                ))}
                            </ul>
                            <button className="btn btn-danger mt-3" onClick={handleDelete}>Remove Selected Members</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <Link to="/CreateTeamRoster" className="nav-link">Add Team Members</Link>
                <span className="link-space"></span>
                <Link to="/TeamRosterList" className="nav-link">View Team Rosters</Link><br />
                <Link to="/home">Go to Home</Link>
            </div>
        </div>
    );
};
