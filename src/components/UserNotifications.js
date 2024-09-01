import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { useSelector } from 'react-redux';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { fetchNotifications, markNotificationAsRead } from './notificationService'; // Ensure the path is correct
import './UserNotifications.css';

const UserNotifications = () => {
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const notificationsCollection = collection(db, 'employee', user.uid, 'notifications');
        const notificationSnapshot = await getDocs(notificationsCollection);
        const userNotifications = notificationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(userNotifications);

        // Calculate unread notifications
        const unread = userNotifications.filter(notification => !notification.read).length;
        setUnreadCount(unread);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const notificationRef = doc(db, 'employee', user.uid, 'notifications', id);
      await updateDoc(notificationRef, { read: true });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

      // Update unread count
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h2>
      <ul className="notifications-list">
        {notifications.map((notification) => (
          <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
            <p>{notification.message}</p>
            <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotifications;
