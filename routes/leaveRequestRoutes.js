const express = require('express');
const { createLeaveRequest, getMyLeaveRequests } = require('../controllers/leaveRequestController');
const authMiddleware = require('../middleware/authMiddleware');  // Assuming you have this middleware

const router = express.Router();

// Route for creating a leave request
router.post('/create', authMiddleware, createLeaveRequest);

// Route for getting leave requests
router.get('/my-requests', authMiddleware, getMyLeaveRequests);

module.exports = router;
