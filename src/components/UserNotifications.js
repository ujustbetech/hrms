import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { IoNotificationsOutline, IoNotifications } from 'react-icons/io5';
import { FaArrowRightLong } from 'react-icons/fa6';

import './UserNotifications.css';

const UserNotifications = () => {
  const user = useSelector((state) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown box

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const notificationsCollection = collection(db, 'employee', user.uid, 'notifications');
        const notificationSnapshot = await getDocs(notificationsCollection);
        const userNotifications = notificationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(userNotifications);

        // Calculate unread notifications
        const unread = userNotifications.filter((notification) => !notification.read).length;
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
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleBellClick = () => {
    setShowDropdown((prev) => !prev);
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false); // Close the dropdown if clicked outside
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bell-container">
      {showDropdown ? (
        <IoNotifications className="notification-icon" onClick={handleBellClick} title="View Notifications" />
      ) : (
        <IoNotificationsOutline className="notification-icon" onClick={handleBellClick} title="View Notifications" />
      )}

      {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}

      {showDropdown && (
        <div ref={dropdownRef} className="notifications-dropdown">
          <ul className="notifications-list">
            <h3 className="n-header">
              Notifications 
            </h3>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
                  <div className="notification-content">
                    <p>
                      <strong>{notification.senderName}</strong> {/* Replace with dynamic sender */}
                      {notification.message}
                    </p>
                    <small>{notification.timeAgo}</small> {/* You can format the time for display */}
                  </div>
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
