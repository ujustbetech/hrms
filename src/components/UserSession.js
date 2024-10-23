import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './UserSession.css';
import UserHeader from './UserHeader';
import { FaSearch } from "react-icons/fa";

const UserSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [expandedDates, setExpandedDates] = useState([]);
  const [userName, setUserName] = useState('');
  const [monthFilter, setMonthFilter] = useState(''); // State for filtering by month
  const [dateFilter, setDateFilter] = useState(''); // State for filtering by date
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        // Fetch user's name
        const userDoc = await getDoc(doc(db, 'employee', userId));
        if (userDoc.exists()) {
          setUserName(userDoc.data().displayName);
        }

        // Fetch user sessions
        const sessionsCollection = collection(db, 'employee', userId, 'sessions');
        const sessionSnapshot = await getDocs(sessionsCollection);
        const userSessions = sessionSnapshot.docs
          .map(doc => ({
            date: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setSessions(userSessions);
      } catch (error) {
        console.error('Error fetching user data or sessions:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const toggleDate = (date) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Case-insensitive filtering for month and date separately
  const filteredSessions = sessions.filter((session) => {
    const month = session.currentMonth || '';
    const date = formatDate(session.date);
    const lowerCaseMonthFilter = monthFilter.toLowerCase(); // Convert monthFilter to lowercase
    const lowerCaseDateFilter = dateFilter.toLowerCase(); // Convert dateFilter to lowercase

    const matchesMonth = month.toLowerCase().includes(lowerCaseMonthFilter); // Month case-insensitive match
    const matchesDate = date.toLowerCase().includes(lowerCaseDateFilter); // Date case-insensitive match

    // Return sessions that match both filters or either if the other is empty
    return (monthFilter === '' || matchesMonth) && (dateFilter === '' || matchesDate);
  });

  return (
    <>
      <UserHeader />
      <div className="sessions-panel-wrapper">
        <div className="user-session">
          <h2>Attendance {userName && `of ${userName}`}</h2>
          <button className="m-button-5" onClick={() => window.history.back()}>
            Back
          </button>
        
        

          <div className="session-table-container">
            {filteredSessions.length > 0 ? (
              <table className="session-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Date</th>
                    <th>Login Time</th>
                    <th>Logout Time</th>
                  </tr>
                </thead>
                <thead>
            <tr>
              <th>
                 
          <div className="search">
            {/* Filter by month */}
            <input
              type="text"
              placeholder="Filter by month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)} // Update month filter
            />
             <button type="submit" class="searchButton">
        <FaSearch/>
     </button>
            </div>
            
  </th>
              <th>
              <div className="search">
              <input
              type="text"
              placeholder="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)} // Update date filter
            />
            <button type="submit" class="searchButton">
        <FaSearch/>
     </button>
          </div>
                </th>
                <th></th>
                <th></th>
                </tr>
                </thead>
                
                <tbody>
                  {filteredSessions.map((session) => (
                    <React.Fragment key={session.date}>
                      <tr
                        className="date-row"
                        onClick={() => toggleDate(session.date)}
                        style={{ cursor: 'pointer', color: '#004085' }}
                      >
                        <td>{session.currentMonth || 'N/A'}</td>
                        <td>{formatDate(session.date)} {expandedDates.includes(session.date) ? '▲' : '▼'}</td>
                        <td colSpan="2"></td>
                      </tr>
                      {expandedDates.includes(session.date) &&
                        session.sessions.map((sessionDetail, i) => (
                          <tr key={`${session.date}-${i}`}>
                            <td></td>
                            <td></td>
                            <td>{sessionDetail.loginTime ? formatDateTime(sessionDetail.loginTime) : 'N/A'}</td>
                            <td>{sessionDetail.logoutTime ? formatDateTime(sessionDetail.logoutTime) : 'Still Logged In'}</td>
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
