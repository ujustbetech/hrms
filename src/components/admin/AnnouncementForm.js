import React, { useState } from 'react';
import { db } from '../../firebaseConfig'; // Adjust this path
import { collection, addDoc, Timestamp ,setDoc} from 'firebase/firestore';

const AnnouncementForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add announcement to announcements collection
      const announcementRef = await addDoc(collection(db, 'announcements'), {
        title,
        content,
        date: Timestamp.now(),
      });

      // Add notification to notifications collection
      const notificationMessage = `New announcement posted: ${title}`;
      await addDoc(collection(db, 'notifications'), {
        message: notificationMessage,
        date: Timestamp.now(),
        isRead: false, // Assuming you want to track if users read it
      });

      alert('Announcement and notification posted successfully!');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error posting announcement or notification: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post New Announcement</h2>
      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label>Content</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Post Announcement</button>
    </form>
  );
};

export default AnnouncementForm;
