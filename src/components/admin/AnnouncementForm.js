import React, { useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import logo from '../../videoframe_logo.png';
import Header from '../Header';
import Navbar from '../Navbar';

const AnnouncementForm = () => {
  const [announcement, setAnnouncement] = useState('');

  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value);
  };

  const sendAnnouncement = async () => {
    if (!announcement) return;

    try {
      // Get all users (assuming users are in 'employee' collection)
      const employeesCollection = collection(db, 'employee');
      const employeeSnapshot = await getDocs(employeesCollection);

      const promises = [];
      
      // Add the notification to each user
      employeeSnapshot.forEach((doc) => {
        const notificationsCollection = collection(db, 'employee', doc.id, 'notifications');
        const promise = addDoc(notificationsCollection, {
          message: announcement,
          read: false, // Mark as unread by default
          timestamp: new Date(),
        });
        promises.push(promise);
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Clear the input field after sending
      setAnnouncement('');
      alert('Announcement sent to all users');
      
    } catch (error) {
      console.error('Error sending announcement:', error);
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
    <div className="leave-container">
      <h2>Send Announcement</h2>
      <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button>
      <div className="form-group">
      <textarea
        value={announcement}
        onChange={handleAnnouncementChange}
        placeholder="Enter your announcement"
      />
    </div>
      <button className="m-button" onClick={sendAnnouncement}>Send </button>
    </div>
    </div>
    </main>
    </>
  );
};

export default AnnouncementForm;
