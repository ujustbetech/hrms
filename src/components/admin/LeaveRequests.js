import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './LeaveRequests.css';
import Header from '../Header';
import Navbar from '../Navbar';
import logo from '../../videoframe_logo.png';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const leaveRequestsCollection = collection(db, 'leaveRequests');
      const leaveRequestsSnapshot = await getDocs(leaveRequestsCollection);

      const requests = leaveRequestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort the leave requests by startDate or createdAt in descending order (latest first)
      const sortedRequests = requests.sort((a, b) => {
        const dateA = new Date(a.startDate || a.createdAt);
        const dateB = new Date(b.startDate || b.createdAt);
        return dateB - dateA; // Sort in descending order (latest on top)
      });

      setLeaveRequests(sortedRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  return (
    <>
      <Header />
      <div className='logoContainer'>
        <img src={logo} alt="Logo" className="logos" />
      </div>
      <Navbar />
      <main className='maincontainer'>
      <div className="leave-requests-container">
        <h2>Leave Requests</h2>
        <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button>
        {leaveRequests.length > 0 ? (
          <table className="leave-requests-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Details</th>
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
                    <Link to={`/leave-request/${request.id}`} className="m-button-6">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="loader-container">
          <svg className="load" viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
          </div>
        )}
      </div>
      </main>
    </>
  );
};

export default LeaveRequests;
