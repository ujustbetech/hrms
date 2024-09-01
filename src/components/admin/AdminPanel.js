import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc,getDocs, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdminPanel.css';
import logo from '../../videoframe_logo.png';

const AdminPanel = () => {
  const [usersData, setUsersData] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchAllUsersData();
    fetchLeaveRequests();
  }, []);

  const fetchAllUsersData = async () => {
    try {
      const employeesCollection = collection(db, 'employee');
      const employeeSnapshot = await getDocs(employeesCollection);
      const users = employeeSnapshot.docs.map(doc => ({
        uid: doc.id,
        displayName: doc.data().displayName
      }));
      setUsersData(users);
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const leaveRequestsCollection = collection(db, 'leaveRequests');
      const leaveRequestsSnapshot = await getDocs(leaveRequestsCollection);
      const requests = leaveRequestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };
  const handleUpdateLeaveStatus = async (id, status, userId, displayName) => {
    try {
      // Update leave status
      const leaveRequestRef = doc(db, 'leaveRequests', id);
      await updateDoc(leaveRequestRef, { status });
      setLeaveRequests(leaveRequests.map(req => (req.id === id ? { ...req, status } : req)));
      
      // Add notification to Firestore
      const notificationRef = collection(db, 'employee', userId, 'notifications');
      await addDoc(notificationRef, {
        message: `Your leave request has been ${status.toLowerCase()}.`,
        read: false,
        timestamp: new Date().toISOString(),
      });
  
      console.log('Notification sent:', displayName);
    } catch (error) {
      console.error('Error updating leave status and sending notification:', error);
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="admin-panel">
        <div className="header">
          <img src={logo} alt="Logo" className="logo" />
          <h2>User List</h2>
        </div>
        <div className="users-table-container">
          {usersData.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map(user => (
                  <tr key={user.uid}>
                    <td>
                      <Link to={`/user-sessions/${user.uid}`} className="user-link">
                        {user.displayName || 'N/A'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-user-data">No users data available.</p>
          )}
        </div>

        <div className="leave-requests-container">
          <h2>Leave Requests</h2>
          {leaveRequests.length > 0 ? (
            <table className="leave-requests-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.displayName}</td>
                    <td>{request.leaveType}</td>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.status}</td>
                    <td>
                      <button onClick={() => handleUpdateLeaveStatus(request.id, 'Approved')}>
                        Approve
                      </button>
                      <button onClick={() => handleUpdateLeaveStatus(request.id, 'Declined')}>
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leave requests available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
