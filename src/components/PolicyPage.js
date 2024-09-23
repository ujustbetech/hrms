import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';  
import { collection, getDocs, orderBy, query } from 'firebase/firestore'; 
import UserHeader from './UserHeader';

const PolicyPage = () => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        const fetchPolicies = async () => {
            const policiesCollection = collection(db, 'policies');
            const q = query(policiesCollection, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            setPolicies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchPolicies();
    }, []);

    return (
        <>
        <UserHeader/>   
          <div className="sessions-panel-wrapper">
            <div className="user-session">
            <h2>Organizational Policy</h2>
            <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button>
              <div className="session-table-container">
            <table className="sessions-table">
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Policy </th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((policy, index) => (
                        <tr key={policy.id}>
                            <td>{index + 1}</td>
                            <td>{policy.name}</td>
                            <td>
                                <a className="m-button-6" href={policy.url} target="_blank" rel="noopener noreferrer">
                                    View
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        </div>
        </div>
        
        </>
    );
};

export default PolicyPage;
