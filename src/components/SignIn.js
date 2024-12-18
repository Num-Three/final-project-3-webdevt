import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Login = ({ changeLogStatus, setUserId }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [redirect, setRedirect] = useState(null); // null means no redirection
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]); // Store fetched users

    // Admin credentials
    const adminCredentials = {
        username: "Admin",
        password: "admin123",
        id: 0,
    };

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/user");
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            // Check if the user is an admin
            if (
                formData.username.trim() === adminCredentials.username &&
                formData.password.trim() === adminCredentials.password
            ) {
                setUserId(adminCredentials.id);
                setRedirect("/admin/dashboard"); // Redirect to admin dashboard
            } else {
                // Find a matching user from fetched data
                const matchedUser = users.find(
                    (user) =>
                        user.username === formData.username.trim() &&
                        user.password === formData.password.trim()
                );

                if (matchedUser) {
                    setErrors({});
                    setUserId(matchedUser.id);
                    setRedirect(`/${matchedUser.id}/dashboard`); // Redirect to user dashboard
                } else {
                    setErrors({ general: 'Invalid username or password.' });
                }
            }
        }

        // Reset the form after submission
        setFormData({ username: '', password: '' });
    };

    if (redirect) {
        changeLogStatus(true)
        return <Navigate to={redirect} replace />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 main">
                    <h2>Sign-In</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter Username"
                            className="form-control"
                        />
                        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter Password"
                            className="form-control"
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>

                    {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

                    <button className="btn btn-primary" type="submit">Log In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
