const { query } = require('../confing/db');  // Import the query function


const createLeaveRequest = async (req, res) => {
  console.log('Received leave request data:', req.body); // Log incoming data for debugging

  const { subject, content, from, to } = req.body;
  const studentId = req.user.studentId; // Get studentId from the JWT payload

  if (!subject || !content || !from || !to) {
    return res.status(400).json({ message: 'Subject, content, from, and to are required' });
  }

  try {
    // Insert the leave request into the database
    await query(
      'INSERT INTO LeaveRequest (Subject, Content, StudentID, FromDate, ToDate) VALUES (?, ?, ?, ?, ?)', 
      [subject, content, studentId, from, to]
    );
    return res.status(201).json({ message: 'Leave request submitted successfully' });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Get the leave requests of the authenticated user
const getMyLeaveRequests = async (req, res) => {
  console.log('Fetching leave requests for studentId:', req.user.studentId); // Log for debugging
  
  const studentId = req.user.studentId;  // Get the student ID from the JWT payload

  try {
    // Retrieve the leave requests from the database for the authenticated student
    const result = await query(
      'SELECT * FROM LeaveRequest WHERE StudentID = ?',
      [studentId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No leave requests found' });
    }

    return res.status(200).json(result);  // Send back the leave requests
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createLeaveRequest, getMyLeaveRequests };
