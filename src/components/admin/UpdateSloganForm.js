import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Your Firestore configuration
import logo from '../../videoframe_logo.png';
import Header from '../Header';
import Navbar from '../Navbar';
import './UpdateSlogan.css'

const UpdateSloganForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sloganRef = doc(db, "slogans", "currentSlogan");

    try {
      await setDoc(sloganRef, {
        title: title,
        content: content,
        date: new Date().toLocaleDateString() // Optional, for daily updates
      });
      alert("Slogan updated successfully!");
    } catch (error) {
      console.error("Error updating slogan:", error);
    }
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
      <h2>Update Daily Slogan</h2>
      <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label>Title (H1):</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Content (P):</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button className="m-button" type="submit">Update Slogan</button>
      </form>
    </div>
    </div>
    </main>
    </>
  );
};

export default UpdateSloganForm;
