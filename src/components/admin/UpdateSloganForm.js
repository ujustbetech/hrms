import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Your Firestore configuration

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
    <div>
      <h2>Update Daily Slogan</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title (H1):</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content (P):</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Update Slogan</button>
      </form>
    </div>
  );
};

export default UpdateSloganForm;
