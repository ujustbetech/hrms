import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './LeaveRequestDetail.css';
import logo from '../../videoframe_logo.png';
import Header from '../Header';
import Navbar from '../Navbar';

const LeaveRequestDetail = () => {
  const { id } = useParams(); // Get the leave request ID from the URL
  const [leaveRequest, setLeaveRequest] = useState(null);

  useEffect(() => {
    const fetchLeaveRequestDetail = async () => {
      try {
        const docRef = doc(db, 'leaveRequests', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLeaveRequest(docSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching leave request detail:', error);
      }
    };

    fetchLeaveRequestDetail();
  }, [id]);

  const handleUpdateLeaveStatus = async (status) => {
    try {
      let declineReason = '';
      if (status === 'Declined') {
        declineReason = prompt("Please provide a reason for declining the leave:");
        if (!declineReason) return; // Exit if no reason is provided
      }

      const leaveRequestRef = doc(db, 'leaveRequests', id);
      await updateDoc(leaveRequestRef, { status });

      setLeaveRequest((prev) => ({ ...prev, status }));

      const notificationRef = collection(db, 'employee', leaveRequest.userId, 'notifications');
      await addDoc(notificationRef, {
        message: `Your leave request has been ${status.toLowerCase()}${status === 'Declined' ? `: ${declineReason}` : ''}.`,
        read: false,
        timestamp: new Date().toISOString(),
      });

      console.log(`Notification sent to ${leaveRequest.displayName}`);
    } catch (error) {
      console.error('Error updating leave status and sending notification:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!leaveRequest) {
    return (
      <div className="loader-container">
        <svg className="load" viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className='logoContainer'>
        <img src={logo} alt="Logo" className="logos" />
      </div>
      <Navbar />
      <main className='maincontainer'>
        <div className="leave-requests-container">
          <div className="leave-container">
            <h2>Leave Request Details</h2>
            <button className="m-button-5" onClick={() => window.history.back()}>
              Back
            </button>
            <div className='leave-request'>
            <p><strong>Name:</strong> {leaveRequest.displayName}</p>
            <p><strong>Start Date:</strong> {formatDate(leaveRequest.startDate)}</p> {/* Apply formatDate */}
            <p><strong>End Date:</strong> {formatDate(leaveRequest.endDate)}</p> {/* Apply formatDate */}
            <p><strong>Leave Type:</strong> {leaveRequest.leaveType}</p>
            <p><strong>Reason:</strong> {leaveRequest.reason}</p>
            <p><strong>Status:</strong> {leaveRequest.status}</p>
            </div>

            {leaveRequest.status === 'Pending' && (
              <div className="btn-container">
                <button className="approve-btn" onClick={() => handleUpdateLeaveStatus('Approved')}>
                  Approve
                </button>
                <button className="decline-btn" onClick={() => handleUpdateLeaveStatus('Declined')}>
                  Decline
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default LeaveRequestDetail;
