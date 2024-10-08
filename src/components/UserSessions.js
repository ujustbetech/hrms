import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import logo from '../videoframe_logo.png';
import { useNavigate } from 'react-router-dom';  
import './UserSessions.css';
import Header from './Header';
import Navbar from './Navbar';

const UserSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [expandedDates, setExpandedDates] = useState([]);
  const [userName, setUserName] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();  // Initialize useNavigate

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

  const handleBack = () => {
    navigate(-1);  // Navigate back to the previous page
  };

  return (
    <>
      <Header />
      <div className='logoContainer'>
        <img src={logo} alt="Logo" className="logos" />
      </div>
      <Navbar />
      <main className='maincontainer'>
        <div className="sessions-table-container">
          <h2>Attendance {userName && `of ${userName}`}</h2> 
          <button className="m-button-5" onClick={handleBack}>
            Back
          </button>
          {sessions.length > 0 ? (
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Month</th> {/* First column for Month */}
                  <th>Date</th> {/* Second column for Date */}
                  <th>Login Time</th>
                  <th>Logout Time</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <React.Fragment key={session.date}>
                    <tr
                      className="user-link"
                      onClick={() => toggleDate(session.date)}
                      style={{ cursor: 'pointer', color: 'black' }}
                    >
                      <td>{session.currentMonth || 'N/A'}</td> {/* Display Current Month */}
                      <td>{session.date} {expandedDates.includes(session.date) ? '▲' : '▼'}</td> {/* Date column */}
                      <td colSpan="2"></td>
                    </tr>
                    {expandedDates.includes(session.date) &&
                      session.sessions.map((sessionDetail, i) => (
                        <tr key={`${session.date}-${i}`}>
                          <td></td> {/* Empty cell for alignment */}
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
      </main>
    </>
  );
};

export default UserSessions;
