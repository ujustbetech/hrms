import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc,getDocs, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdminPanel.css';
import logo from '../../videoframe_logo.png';
import Header from '../Header';
import Navbar from '../Navbar';
import ExportToExcel from '../ExportToExcel';
import { IoReturnUpBackOutline } from "react-icons/io5";


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
   
    
    <>
    <Header />
   
    <div className='logoContainer'>
      <img src={logo} alt="Logo" className="logos" />
    </div>
     <Navbar/>
    <main className='maincontainer'>
    <div className="users-table-container">
    {/* <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button> */}
    <ExportToExcel/>
  {usersData.length > 0 ? (
    
    <table className="users-table">
 
      <thead>
        <tr>
          <th>Sr No</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {usersData.map((user, index) => (
          <tr key={user.uid}>
            <td>{index + 1}</td> {/* Display the serial number */}
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
    <div  className="loader-container">
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

export default AdminPanel;
