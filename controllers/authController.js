const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../confing/db');  // Ensure you're using 'query' here (from your db.js)

// Signup Controller
const signup = async (req, res) => {
  const { username, password, name } = req.body;

  try {
    // Check if the username already exists in the database
    const result = await query('SELECT * FROM StudentInfo WHERE Username = ?', [username]);

    if (result.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await query('INSERT INTO StudentInfo (Username, Password, Name) VALUES (?, ?, ?)', [username, hashedPassword, name]);

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await query('SELECT * FROM StudentInfo WHERE Username = ?', [username]);
    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result[0];  // Get the first result

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token using the secret key from the .env file
    const token = jwt.sign(
      { studentId: user.StudentID, username: user.Username },
      process.env.JWT_SECRET,  // Secret key from .env file
      { expiresIn: '1h' }      // Optional: Expiry time of the token (e.g., 1 hour)
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { signup, login };
