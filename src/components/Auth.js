import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from '../firebaseConfig';
import { signInWithPopup, signOut, OAuthProvider, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, collection, getDocs, setDoc, updateDoc, getDoc, arrayUnion, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { setUser, clearUser } from '../store/authSlice';
import './Auth.css';
import MicrosoftLogo from '../microsoft-logo.png';
import UjustbeLogo from '../videoframe_logo.png';
import LeaveModal from './LeaveModal';
import UserNotifications from './UserNotifications';
import { AiOutlineLogin } from "react-icons/ai";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Auth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginTime, setLoginTime] = useState(null); // Step 1: Add state to store login time
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsRef = collection(db, 'employee', user.uid, 'notifications');
        const notificationsQuery = query(notificationsRef, where('read', '==', false));
        const querySnapshot = await getDocs(notificationsQuery);
        const fetchedNotifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);



  useEffect(() => {
    const date = new Date();
    // Format date as 'day/month/year'
    const formattedDate = date.toLocaleDateString('en-GB');
    setCurrentDate(formattedDate);
  }, []);
  const markAsRead = async (id) => {
    try {
      const notificationRef = doc(db, 'employee', user.uid, 'notifications', id);
      await updateDoc(notificationRef, { read: true });
      setNotifications(notifications.filter(notification => notification.id !== id));
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      checkAndCreateNewSession();
    }
  }, [user]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const checkAndCreateNewSession = async () => {
    if (!user || !user.uid) {
      console.error('User not defined or uid missing');
      return;
    }

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const lastSessionDate = localStorage.getItem('lastSessionDate');

    if (!lastSessionDate || currentDate !== lastSessionDate) {
      const userRef = doc(db, 'employee', user.uid);
      await setDoc(userRef, {}, { merge: true });

      const sessionRef = doc(db, 'employee', user.uid, 'sessions', currentDate);

      const newSession = {
        sessionId: now.toISOString(),
        loginTime: now.toLocaleString(),
        logoutTime: null,
      };

      const sessionData = {
        sessions: arrayUnion(newSession),
        currentMonth: month[now.getMonth()],
      };

      await setDoc(sessionRef, sessionData, { merge: true });

      setSessionId(newSession.sessionId);
      localStorage.setItem('sessionId', newSession.sessionId);
      localStorage.setItem('lastSessionDate', currentDate);

      console.log('New session created for date:', currentDate);
    } else {
      console.log('Session already exists for today:', currentDate);
    }
  };

  useEffect(() => {
    const storedLoginTime = localStorage.getItem('loginTime');
    if (storedLoginTime) {
      setLoginTime(storedLoginTime); // Set the login time from localStorage
    }
  }, []);


  const handleLogin = async () => {
    try {
      const provider = new OAuthProvider('microsoft.com');
      provider.setCustomParameters({ prompt: 'select_account' });

      await setPersistence(auth, browserSessionPersistence);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'employee', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName || 'Guest',
        });
      } else {
        await updateDoc(userRef, {
          displayName: user.displayName || 'Guest',
        });
      }

      dispatch(setUser(user));

      const now = new Date();
      const formattedLoginTime = now.toLocaleTimeString();

      // Save login time in localStorage
      localStorage.setItem('loginTime', formattedLoginTime);
      setLoginTime(formattedLoginTime); // Update state

      checkAndCreateNewSession();

    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  const handleLogout = async () => {
    try {
      if (user && sessionId) {
        const currentDate = new Date().toISOString().split('T')[0];
        const sessionRef = doc(db, 'employee', user.uid, 'sessions', currentDate);

        const sessionDoc = await getDoc(sessionRef);

        if (sessionDoc.exists()) {
          const sessionData = sessionDoc.data();
          const updatedSessions = sessionData.sessions.map(session =>
            session.sessionId === sessionId
              ? { ...session, logoutTime: new Date().toLocaleString() }
              : session
          );

          await updateDoc(sessionRef, { sessions: updatedSessions });
          console.log('Session updated with logout time:', sessionId);
        }
      }

      await signOut(auth);
      dispatch(clearUser());
      setSessionId(null);
      localStorage.removeItem('sessionId');
      localStorage.removeItem('lastSessionDate');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  useEffect(() => {
    const fetchSlogan = async () => {
      const sloganRef = doc(db, "slogans", "currentSlogan"); // Fetch the current slogan
      const sloganDoc = await getDoc(sloganRef);

      if (sloganDoc.exists()) {
        const data = sloganDoc.data();
        setTitle(data.title);
        setContent(data.content);
      } else {
        console.log("No slogan found");
      }
    };

    fetchSlogan();
  }, []);

  return (
    <>
      <section className='mainContainer'>
        <div className='headerMain'>
          <div className='logoN'>
            <img src={UjustbeLogo} alt="UJUSTBE Logo" />
          </div>

          {user && (
            <div className='HeaderRight'>
              <nav>

                <div className='background-tabs'>

                  <button className="m-button-2" onClick={() => setIsModalOpen(true)}>
                    Apply Leave
                  </button>

                  <LeaveModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                  />
                  <Link to={`/user-session/${user.uid}`} className="m-button-2">View Your Attendance</Link>
                </div>

              </nav>
              <UserNotifications /> 
            </div>

          )}

        </div>


        <div className='loginMain'>
          <div className='loginLeft'>
            <h1>{title}</h1>
            <p>{content}</p>
            <button className="m-button">Lets Go <MdOutlineArrowForwardIos /></button>
          </div>
          <div className='LoginRight'>
            <div className='loginBox'>
              {!user ? (
                <>
                  <div className="loggedInContainer">
                    <h1>Mark your Attendance</h1>
                    <button className="btn" onClick={handleLogin}>
                      <img src={MicrosoftLogo} alt="Microsoft Logo" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="loggedInContainer">
                  <p className="greeting">Welcome, {user.displayName || 'Guest'}!</p>


                  <p className="time">
                    Today's Date: {currentDate} </p>
                  <p className="time"> Login Time:  {loginTime && ` ${loginTime}`}
                  </p>

                  <button className="m-button" onClick={handleLogout}>Logout <AiOutlineLogin /></button>



                </div>
              )}
            </div>
          </div>
        </div>

        <footer>
          <div className='footerMain'>
            <div className="copy" >© 2024 UJustConnect. All rights reserved.
            </div>
            <div class="social-login-icons">
              <div class="socialcontainer">
                <div class="icon social-icon-1-1">
                  <svg
                    viewBox="0 0 576 512"
                    height="1.7em"
                    xmlns="http://www.w3.org/2000/svg"
                    class="svgIcontwit"
                    fill="white"
                  >
                    <path
                      d="M549.655 124.083C534.338 79.717 497.247 51.804 451.817 49.158C408.285 46.697 343.174 44.7 288.002 44.7c-55.172 0-120.283 1.997-163.815 4.458c-45.43 2.647-82.521 30.559-97.838 74.925C16.372 174.646 0 232.35 0 288.002c0 55.652 16.372 113.356 26.349 163.919c15.317 44.367 52.408 72.278 97.838 74.925c43.532 2.461 108.643 4.458 163.815 4.458s120.283-1.997 163.815-4.458c45.43-2.647 82.521-30.559 97.838-74.925c10.06-50.563 26.438-108.267 26.438-163.919c0-55.652-16.378-113.356-26.346-163.919zM230.75 367.99V208.014L368.261 288L230.75 367.99z"
                    ></path>
                  </svg>
                </div>
                <a href="https://www.youtube.com/@UJustbeUniverse" target="_blank" rel="noopener noreferrer" class="social-icon-1">
                  <svg
                    viewBox="0 0 576 512"
                    height="1.7em"
                    xmlns="http://www.w3.org/2000/svg"
                    class="svgIcontwit"
                    fill="white"
                  >
                    <path
                      d="M549.655 124.083C534.338 79.717 497.247 51.804 451.817 49.158C408.285 46.697 343.174 44.7 288.002 44.7c-55.172 0-120.283 1.997-163.815 4.458c-45.43 2.647-82.521 30.559-97.838 74.925C16.372 174.646 0 232.35 0 288.002c0 55.652 16.372 113.356 26.349 163.919c15.317 44.367 52.408 72.278 97.838 74.925c43.532 2.461 108.643 4.458 163.815 4.458s120.283-1.997 163.815-4.458c45.43-2.647 82.521-30.559 97.838-74.925c10.06-50.563 26.438-108.267 26.438-163.919c0-55.652-16.378-113.356-26.346-163.919zM230.75 367.99V208.014L368.261 288L230.75 367.99z"
                    ></path>
                  </svg>
                </a>

              </div>
              <div class="socialcontainer">
                <div class="icon social-icon-2-2">
                  <svg
                    fill="white"
                    class="svgIcon"
                    viewBox="0 0 448 512"
                    height="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    ></path>
                  </svg>
                </div>
                <a href="https://www.instagram.com/ujustbeuniverse" target="_blank" rel="noopener noreferrer" class="social-icon-2">
                  <svg
                    fill="white"
                    class="svgIcon"
                    viewBox="0 0 448 512"
                    height="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    ></path>
                  </svg>
                </a>
              </div>
              <div class="socialcontainer">
                <div class="icon social-icon-3-3">
                  <svg
                    viewBox="0 0 384 512"
                    fill="white"
                    height="1.6em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                    ></path>
                  </svg>
                </div>
                <a href="https://www.facebook.com/ujustbeuniverse1" target="_blank" rel="noopener noreferrer" class="social-icon-3">
                  <svg
                    viewBox="0 0 384 512"
                    fill="white"
                    height="1.6em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
                    ></path>
                  </svg>
                </a>
              </div>

            </div>
          </div>

        </footer>

      </section>



    </>
  );
};

export default Auth;
