import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Firebase config
import logo from '../../videoframe_logo.png';
import Header from '../Header';
import Navbar from '../Navbar';


const ManageSlogans = () => {
  const [slogans, setSlogans] = useState([]);

  useEffect(() => {
    const fetchSlogans = async () => {
      const slogansCollection = collection(db, 'slogans');
      const sloganSnapshot = await getDocs(slogansCollection);
      const slogansList = sloganSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlogans(slogansList);
    };
    fetchSlogans();
  }, []);

  const deleteSlogan = async (id) => {
    await deleteDoc(doc(db, 'slogans', id));
    setSlogans(slogans.filter((slogan) => slogan.id !== id));
  };

  return (
    <>
    <Header />
    <div className='logoContainer'>
      <img src={logo} alt="Logo" className="logos" />
    </div>
    <Navbar />
    <main className='maincontainer'>
    <div className="leave-requests-container">
    <div className="leave-container">
      <h2>Manage Slogans</h2>
      <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button>
      {/* <Link to="/add-slogan" className="add-slogan-link">
        Add New Slogan
      </Link> */}

      <div className="form-group">
        {slogans.map((slogan) => (
          <div key={slogan.id} className="slogan">
            <h3>{slogan.title}</h3>
            <p>{slogan.description}</p>
            <button className="m-button-6" onClick={() => deleteSlogan(slogan.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>     
    </div>
    </div>
    </main>
    </>
  );
};

export default ManageSlogans;
