import React from 'react'; 
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import './ExportToExcel.css';

const ExportToExcel = () => {
  const fetchDataAndExport = async () => {
    try {
      const employeeSnapshot = await getDocs(collection(db, 'employee'));  // Fetch all employee documents
      const data = [];

      for (const employeeDoc of employeeSnapshot.docs) {
        const employeeData = employeeDoc.data();
        const Name = employeeData.displayName;

        // Fetch the sessions subcollection for each employee
        const sessionsSnapshot = await getDocs(collection(db, 'employee', employeeDoc.id, 'sessions'));

        sessionsSnapshot.forEach((sessionDoc) => {
          const sessionData = sessionDoc.data();

          // Check if 'sessions' is an array and loop over each session
          if (Array.isArray(sessionData.sessions)) {
            // Extract the date from sessionData (using sessionDoc.id which is the date)
            const sessionDate = sessionDoc.id; // This is the date of the session

            sessionData.sessions.forEach((session) => {
              const sessionId = session.sessionId || 'N/A';
              const loginTime = session.loginTime || 'N/A';
              const logoutTime = session.logoutTime || 'N/A';
              const month = sessionData.currentMonth || 'N/A';  // Assuming currentMonth is the current date

              // Handling the loginTime from Firestore (assumed Firestore Timestamp)
              const formattedLoginTime = loginTime
                ? new Date(loginTime.seconds * 1000).toLocaleTimeString() // Format time
                : 'N/A';

              const formattedLogoutTime = logoutTime
                ? new Date(logoutTime.seconds * 1000).toLocaleTimeString() // Format time
                : 'N/A';

              // Add data to array for Excel export
              data.push({
                Name,
                month,                     // Month column
                date: sessionDate,         // Date column (from sessionDoc.id)
                loginTime,  // Keeping login time column
                logoutTime // Keeping logout time column
              });
            });
          }
        });
      }

      // Convert data to worksheet and export
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Sessions");

      // Export the Excel file with a static name
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
