import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import logo from '../videoframe_logo.png';
import './UserSession.css';
import UserHeader from './UserHeader';

const UserSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [expandedDates, setExpandedDates] = useState([]);
  const [userName, setUserName] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        // Fetch user's name
        const userDoc = await getDoc(doc(db, 'employee', userId));
        if (userDoc.exists()) {
          setUserName(userDoc.data().displayName); // Assuming the user's name is stored under 'displayName'
        }

        // Fetch user sessions
        const sessionsCollection = collection(db, 'employee', userId, 'sessions');
        const sessionSnapshot = await getDocs(sessionsCollection);
        const userSessions = sessionSnapshot.docs
          .map(doc => ({
            date: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
        setSessions(userSessions);
      } catch (error) {
        console.error('Error fetching user data or sessions:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const toggleDate = (date) => {
    setExpandedDates((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date]
    );
  };

  return (
    <>
    <UserHeader/>   
      <div className="sessions-panel-wrapper">
        <div className="user-session">
        <h2>Attendance {userName && `of ${userName}`}</h2> 
          <div className="session-table-container">
            {sessions.length > 0 ? (
              <table className="session-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Login Time</th>
                    <th>Logout Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <React.Fragment key={session.date}>
                      <tr
                        className="date-row"
                        onClick={() => toggleDate(session.date)}
                        style={{ cursor: 'pointer', color: '#004085' }}
                      >
                        <td>{session.date} {expandedDates.includes(session.date) ? '▲' : '▼'}</td>
                        <td colSpan="2"></td>
                      </tr>
                      {expandedDates.includes(session.date) &&
                        session.sessions.map((sessionDetail, i) => (
                          <tr key={`${session.date}-${i}`}>
                            <td></td>
                            <td>{sessionDetail.loginTime}</td>
                            <td>{sessionDetail.logoutTime || 'Still Logged In'}</td>
                          </tr>
                        ))}
                    </React.Fragment>
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
        </div>
      </div>
    </>

  );
};

export default UserSessions;
