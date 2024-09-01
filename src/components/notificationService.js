import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path based on your project structure
import {  doc, updateDoc } from 'firebase/firestore';
// Fetch notifications for a specific user
export const fetchNotifications = async (userId) => {
  try {
    const notificationsRef = collection(db, 'employee', userId, 'notifications');
    const notificationSnapshot = await getDocs(notificationsRef);
    const notifications = notificationSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (userId, id) => {
  try {
    const notificationRef = doc(db, 'employee', userId, 'notifications', id);
    await updateDoc(notificationRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};
