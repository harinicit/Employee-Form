import React, { useState } from 'react';
import axios from 'axios';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const initialState = {
    name: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    department: 'HR',
    dateOfJoining: '',
    role: ''
  };

  const [employeeData, setEmployeeData] = useState(initialState);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (Object.values(employeeData).some((value) => value === '')) {
      setError('All fields are required!');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/employees', employeeData);
      console.log('Response:', response); // Log the response

      if (response.status === 201) {
        setSuccessMessage('Employee added successfully!');
        setError('');
        setEmployeeData(initialState); // Reset form to initial state
      } else {
        setError('Unexpected response from the server');
        setSuccessMessage('');
      }
    } catch (err) {
      console.error('Error:', err); // Log error details for debugging

      if (err.response) {
        // If the error has a response, use the error message from the backend
        setError(err.response.data.message || 'Failed to add employee');
      } else {
        // If no response, likely network-related error
        setError('Network error. Please try again later.');
      }
      setSuccessMessage('');
    }
  };

  const handleReset = () => {
    setEmployeeData(initialState);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="employee-form">
      <h2>Add Employee</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={employeeData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            value={employeeData.employeeId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={employeeData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Department:</label>
          <select
            name="department"
            value={employeeData.department}
            onChange={handleChange}
            required
          >
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date of Joining:</label>
          <input
            type="date"
            name="dateOfJoining"
            value={employeeData.dateOfJoining}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
