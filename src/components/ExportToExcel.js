import React from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import './ExportToExcel.css'

const ExportToExcel = () => {
  const fetchDataAndExport = async () => {
    try {
      const employeeSnapshot = await getDocs(collection(db, 'employee'));  // Fetch all employee documents

      const data = [];

      for (const employeeDoc of employeeSnapshot.docs) {
        const employeeData = employeeDoc.data();
        const displayName = employeeData.displayName;

        // Fetch the sessions subcollection for each employee
        const sessionsSnapshot = await getDocs(collection(db, 'employee', employeeDoc.id, 'sessions'));

        sessionsSnapshot.forEach((sessionDoc) => {
          const sessionData = sessionDoc.data();
          
          // Check if 'sessions' is an array and loop over each session
          if (Array.isArray(sessionData.sessions)) {
            sessionData.sessions.forEach((session) => {
              const sessionId = session.sessionId || 'N/A';
              const loginTime = session.loginTime || 'N/A';
              const logoutTime = session.logoutTime || 'N/A';
              const currentDate = sessionData.currentMonth || 'N/A';  // Assuming currentMonth is the current date

              // Add data to array for Excel export
              data.push({
                displayName,
                sessionId,
                loginTime,
                logoutTime,
                currentDate
              });
            });
          }
        });
      }

      // Convert data to worksheet and export
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Sessions");

      XLSX.writeFile(workbook, "employee_sessions_data.xlsx");
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

  return (
    <div className="export-button-container">
    <button className="export-button" onClick={fetchDataAndExport}>
      Download XLS
    </button>
  </div>
  
  );
};

export default ExportToExcel;
