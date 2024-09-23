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
import AnnouncementForm from './components/admin/AnnouncementForm';
import ManageSlogans from './components/admin/ManageSlogans';
import AddSlogan from './components/admin/AddSlogan';
import PolicyPage from './components/PolicyPage';
import AdminUploadPDF from './components/admin/AdminUploadPDF';

const App = () => {
  return (
    <Router>
      
    
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/leave-requests" element={<LeaveRequests />} />
        <Route path="/leave-request/:id" element={<LeaveRequestDetail />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/add-slogan" element={<AddSlogan/>} />
        <Route path="/manage-slogans" element={<ManageSlogans />} />
        <Route path="/update-announcement" element={<AnnouncementForm/>} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/uploadpdf" element={<AdminUploadPDF/>} />
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
