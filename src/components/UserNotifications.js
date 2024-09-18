import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { IoNotificationsOutline, IoNotifications  } from "react-icons/io5";

import './UserNotifications.css';

const UserNotifications = () => {
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleBellClick = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <div className="bell-container">
      {showDropdown?<IoNotifications className='notification-icon'  onClick={handleBellClick}
        title="View Notifications" />:<IoNotificationsOutline className='notification-icon'  onClick={handleBellClick}
        title="View Notifications 2" />}
      
      {/* <FontAwesomeIcon
        icon={unreadCount > 0 ? faBell : faBellSlash}
        className="bell-icon"
        onClick={handleBellClick}
        title="View Notifications"
      /> */}
      {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      {showDropdown && (
        <div className="notifications-dropdown">
          <ul className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
                  <p>{notification.message}</p>
                  {!notification.read && (
                    <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                  )}
                </li>
              ))
            ) : (
              <li>No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
