import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const SignUp = ({ changeLogStatus }) => {  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({}); 
  const [redirect, setRedirect] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // VALIDATIONS
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      try {
        const response = await fetch('http://localhost:5000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          alert('Account created successfully!');
          setRedirect(true); 
        } else {
          alert('Failed to create account. Please try again.');
        }
      } catch (error) {
        console.error('Error signing up:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle redirection after successful sign-up
  if (redirect) {
    changeLogStatus(false);  // Reset logStatus to false for login
    return <Navigate to={`/signin`} replace />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 main">
          <h2>Sign Up</h2>
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
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              className="form-control"
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
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

          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="form-control"
            />
            {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
          </div>

          <button className="btn btn-primary" type="submit">
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <span
            onClick={() => {
              changeLogStatus(true); setRedirect(true) // Correctly set status to show login
            }}
            style={{ color: 'blue', cursor: 'pointer' }}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
