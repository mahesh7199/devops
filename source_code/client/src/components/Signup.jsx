import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Signup() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleFirstnameChange = (e) => setFirstname(e.target.value);
    const handleLastnameChange = (e) => setLastname(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const isFormValid = () => firstname && lastname && username && password;

    const submitForm = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            alert('Please fill all fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/createUser', {
                firstname,
                lastname,
                username,
                password
            });

            if (response.status === 201) {
                alert('Signup Successful');
                navigate('/');
            } else {
                alert('Signup Failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Error in Signup');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <form onSubmit={submitForm}>
                    <p>SIGNUP PAGE</p>
                    <input type="text" placeholder="First Name" value={firstname} onChange={handleFirstnameChange} /><br />
                    <input type="text" placeholder="Last Name" value={lastname} onChange={handleLastnameChange} /><br />
                    <input type="text" placeholder="Username" value={username} onChange={handleUsernameChange} /><br />
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} /><br />
                    <button type="submit">Signup</button><br />
                    <p>Already have an account? <Link to="/">Login</Link></p>
                </form>
            </header>
        </div>
    );
}

export default Signup;
