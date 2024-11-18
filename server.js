const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');  
const { connectDB } = require('./confing/db');
const cors = require('cors');

dotenv.config(); 

const app = express();


app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true,  // Allow cookies or credentials to be sent
}));

connectDB();


app.use('/api/auth', authRoutes);  
app.use('/api/leave-requests', leaveRequestRoutes);  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

