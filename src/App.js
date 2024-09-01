import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import AdminPanel from './components/admin/AdminPanel';
import UserSessions from './components/UserSessions';
import LeaveApplication from './components/LeaveApplication';
import UserNotifications from './components/UserNotifications';
import './App.css';


const App = () => {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/user-sessions/:userId" element={<UserSessions />} />
          <Route path="/apply-leave" element={<LeaveApplication />} />
          <Route path="/notifications" element={<UserNotifications/>} />
        </Routes>
      
    </Router>
  );
};

export default App;
