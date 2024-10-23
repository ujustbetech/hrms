import React from 'react'; 
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import './ExportToExcel.css';

const ExportToExcel = () => {

  // Function to format date and time to dd/mm/yyyy hh:mm:ss
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

  const fetchDataAndExport = async () => {
    try {
      const employeeSnapshot = await getDocs(collection(db, 'employee'));  
      const data = [];

      for (const employeeDoc of employeeSnapshot.docs) {
        const employeeData = employeeDoc.data();
        const Name = employeeData.displayName;

        const sessionsSnapshot = await getDocs(collection(db, 'employee', employeeDoc.id, 'sessions'));

        sessionsSnapshot.forEach((sessionDoc) => {
          const sessionData = sessionDoc.data();

          if (Array.isArray(sessionData.sessions)) {
            // Extract the date from sessionData (using sessionDoc.id which is the date)
            const sessionDate = sessionDoc.id;

            sessionData.sessions.forEach((session) => {
              const sessionId = session.sessionId || 'N/A';
              const loginTime = session.loginTime ? formatDateTime(session.loginTime) : 'N/A'; // Format login time
              const logoutTime = session.logoutTime ? formatDateTime(session.logoutTime) : 'N/A'; // Format logout time
              const month = sessionData.currentMonth || 'N/A';  

              // Add data to array 
              data.push({
                Name,
                month,                      
                date: sessionDate,          
                loginTime,  
                logoutTime 
              });
            });
          }
        });
      }

      // Convert data to worksheet and export
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Sessions");

      // Export the Excel file with name
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
