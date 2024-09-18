import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedRoute from './components/admin/ProtectedRoute';
import UserSessions from './components/UserSessions';
import LeaveRequests from './components/admin/LeaveRequests';  // Correct import
import LeaveRequestDetail from './components/admin/LeaveRequestDetail';
import LeaveApplication from './components/LeaveApplication';
import UserNotifications from './components/UserNotifications';
import UserSession from './components/UserSession';

// import ExportToExcel from './components/ExportToExcel';
import './App.css';
import UpdateSloganForm from './components/admin/UpdateSloganForm';
import AnnouncementForm from './components/admin/AnnouncementForm';

const App = () => {
  return (
    <Router>
      
    
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/leave-request/:id" element={<LeaveRequestDetail />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/update-slogan" element={<UpdateSloganForm/>} />
        <Route path="/update-announcement" element={<AnnouncementForm/>} />
        {/* Protect the admin panel route */}
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
         <Route path="/user-session/:userId" element={<UserSession />} />
        <Route path="/user-sessions/:userId" element={<UserSessions />} />
        <Route path="/apply-leave" element={<LeaveApplication />} />
        <Route path="/notifications" element={<UserNotifications />} />
      </Routes>
    </Router>
  );
};

export default App;
