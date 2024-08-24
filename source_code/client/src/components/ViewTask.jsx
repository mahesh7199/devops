import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:9000/getTasks'); // Endpoint to fetch tasks
                console.log("Tasks fetched:", response.data);
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            await axios.patch(`http://localhost:9000/updateTask/${taskId}`, { status: newStatus });
            // Update task status in state
            setTasks(currentTasks => 
                currentTasks.map(task => 
                    task._id === taskId ? { ...task, status: newStatus } : task));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div>
            <h2>View Tasks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>User Story Name</th>
                        <th>Created By</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id}>
                            <td>{task.taskDescription || 'No description available'}</td>
                            <td>{task.userStoryId ? task.userStoryId.user_story : 'Unavailable'}</td>
                            <td>{task.createdBy ? `${task.createdBy.firstname} ${task.createdBy.lastname}` : 'Unavailable'}</td>
                            <td>
                                <select value={task.status} onChange={(e) => handleUpdateStatus(task._id, e.target.value)}>
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/CreateTask" className="nav-link">Create Tasks</Link>
            <span className="link-space"></span>
            <Link to="/home" className="nav-link">Go to Home</Link><br />
        </div>
    );
};

export default ViewTasks;
