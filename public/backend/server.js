const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON requests

// MySQL connection setup
const pool = mysql.createPool({
  host: 'localhost',         // Your MySQL host (usually 'localhost')
  user: 'root',              // Your MySQL username (usually 'root')
  password: '87478@Harini', // Replace with your MySQL password
  database: 'employee',    // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// POST Endpoint to Add Employee
app.post('/api/employees', (req, res) => {
  console.log('Received data:', req.body);  // Log the received request body

  const { name, employeeId, email, phoneNumber, department, dateOfJoining, role } = req.body;

  // Check if all required fields are present
  if (!name || !employeeId || !email || !phoneNumber || !department || !dateOfJoining || !role) {
    console.log('Missing fields');
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  // Check for duplicate Employee ID
  pool.query('SELECT * FROM employees WHERE employeeId = ?', [employeeId], (err, results) => {
    if (err) {
      console.error('Error checking for duplicate employee ID:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      console.log('Duplicate Employee ID');
      return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    }

    // SQL query to insert new employee into the MySQL database
    const query = 'INSERT INTO employees (name, employeeId, email, phoneNumber, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [name, employeeId, email, phoneNumber, department, dateOfJoining, role], (err, results) => {
      if (err) {
        console.error('Error inserting employee into database:', err);
        return res.status(500).json({ success: false, message: 'Failed to add employee' });
      }

      const newEmployee = { name, employeeId, email, phoneNumber, department, dateOfJoining, role };
      console.log('Employee added:', newEmployee); // Log added employee details

      res.status(201).json({ success: true, data: newEmployee });
    });
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
