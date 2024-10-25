import React, { useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure you have the correct Firebase configuration
import logo from '../../videoframe_logo.png'; // Update logo path accordingly
import Header from '../Header'; // Assuming you have these components in your project
import Navbar from '../Navbar'; // Update the import paths as per your project structure

const AnnouncementForm = () => {
  const [announcement, setAnnouncement] = useState('');
  const [error, setError] = useState(''); // For handling errors
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback

  // Handle input change
  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value);
    setError(''); // Clear the error message
  };

  // Send Announcement function
  const sendAnnouncement = async () => {
    // Check if the announcement field is empty
    if (!announcement) {
      setError('Please enter an announcement before sending');
      return;
    }

    try {
      // Add the announcement to the global 'announcements' collection
      const announcementRef = await addDoc(collection(db, 'announcements'), {
        message: announcement,
        timestamp: new Date(),
        createdBy: 'Admin Name', // You can replace this with the admin's name or UID
      });

      // Fetch all users from the 'employee' collection
      const employeesCollection = collection(db, 'employee');
      const employeeSnapshot = await getDocs(employeesCollection);

      const promises = [];

      // Loop through each user and add the announcement to their notifications subcollection
      employeeSnapshot.forEach((doc) => {
        const notificationsCollection = collection(db, 'employee', doc.id, 'notifications');
        const promise = addDoc(notificationsCollection, {
          announcementId: announcementRef.id, // Reference the created announcement
          message: announcement,
          read: false, // Mark as unread initially
          timestamp: new Date(),
        });
        promises.push(promise); // Add each promise to the array for parallel execution
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Clear the input field and show success message
      setAnnouncement('');
      setSuccessMessage('Announcement sent to all users');
      
    } catch (error) {
      console.error('Error sending announcement:', error);
      setError('Failed to send announcement. Please try again.');
    }
  };

  return (
    <>
      {/* Header and Navbar components */}
      <Header />
      <div className="logoContainer">
        <img src={logo} alt="Logo" className="logos" />
      </div>
      <Navbar />
      
      {/* Main Content */}
      <main className="maincontainer">
        <div className="leave-requests-container">
          <div className="leave-container">
            <h2>Send Announcement</h2>
            <button className="m-button-5" onClick={() => window.history.back()}>
              Back
            </button>

            {/* Input Text Area for Announcement */}
            <div className="form-group">
              <textarea
                value={announcement}
                onChange={handleAnnouncementChange}
                placeholder="Enter your announcement"
              />
              {/* Show error if any */}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {/* Show success message if announcement is sent */}
              {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </div>

            {/* Button to Send Announcement */}
            <button className="m-button" onClick={sendAnnouncement}>Send</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default AnnouncementForm;
