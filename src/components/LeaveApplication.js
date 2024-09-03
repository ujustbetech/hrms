import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import logo from '../videoframe_logo.png';
import './LeaveApplication.css';

const LeaveApplication = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleApplyLeave = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (!user) return;

    if (leaveType && startDate && endDate && reason) {
      try {
        const leaveRequestsCollection = collection(db, 'leaveRequests');
        await addDoc(leaveRequestsCollection, {
          userId: user.uid,
          displayName: user.displayName || 'Anonymous',
          leaveType,
          startDate,
          endDate,
          reason,
          status: 'Pending',
          appliedDate: new Date().toISOString(),
        });
        alert('Leave request submitted!');
        
        // Clear form fields after submission
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
      } catch (error) {
        console.error('Error applying for leave:', error);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleBack = () => {
    navigate(-1);  // Navigate back to the previous page
  };

  return (
    <div className="leave-wrapper">
      <div className="leave">
        <div className="logos">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      
        
        <h2>Apply for Leave</h2>
        <form onSubmit={handleApplyLeave}>
          <div className="leave-container">
            <div className="form-group">
              <label>Leave Type:</label>
              <input
                type="text"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Reason:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
        
         {/* Button container */}
  <div className="button-container">
    <button className="buttons" type="submit">
      Apply Now
      <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
        <path
          clipRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
          fillRule="evenodd"
        ></path>
      </svg>
    </button>
    <button className="back-button" onClick={handleBack}>Back</button>
  </div>
</form>
      </div>
    </div>
  );
};

export default LeaveApplication;
