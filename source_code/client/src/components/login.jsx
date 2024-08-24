import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Login() {
    const [userid, setuserid] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function submit1(e) {
        e.preventDefault();

        // Log to check the data being sent
        console.log("Login Request:", { userid, password });

        axios.get('http://localhost:9000/getUser', {
            params: {
                username: userid,
                password: password,
            }
        })
        .then((res) => {
            console.log("API Response:", res.data); // Log the API response
            if (res.data && res.data.username) { // Check if the username exists in the response
                localStorage.clear();
                localStorage.setItem('username', res.data.username);
                navigate('/home');
            } else {
                alert('Wrong Credentials or no data received');
            }
        })
        .catch((err) => {
            console.error(err);
            alert('Error in Login');
        });
    }

    return (
        <div className="App">
            <h2>Welcome to the ICSI-518</h2>
            <br />
            <header className="App-header">
                <form onSubmit={submit1}>
                    <p>LOGIN PAGE</p><br></br>
                    <input type="text" placeholder="username" value={userid} onChange={(e) => setuserid(e.target.value)}></input><br></br>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br></br>
                    <button type="submit">Login</button><br></br>
                    <p>Don't have an account ? <Link to="/Signup">Signup</Link> </p>
                </form>
            </header>
        </div>
    );
}

export default Login;
