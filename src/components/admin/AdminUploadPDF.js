import React, { useState } from 'react';
import { storage, db } from '../../firebaseConfig';  
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';  
import { collection, addDoc } from 'firebase/firestore';
import logo from '../../videoframe_logo.png';
import Header from '../Header';
import Navbar from '../Navbar';

const AdminUploadPDF = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        console.log('File selected:', e.target.files[0]);  // Log selected file
    };

    const handleUpload = async () => {
        if (!file) {
            console.log('No file selected');  // Check if file is selected
            return;
        }

        console.log('Starting upload for:', file.name);  // Log upload start

        // Create a reference to the file in Firebase Storage
        const storageRef = ref(storage, `pdfs/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Log upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                setMessage('Error uploading file: ' + error.message);
                console.error('Upload error:', error);  // Log errors
            },
            async () => {
                // Get the download URL once the file is uploaded
                const downloadURL = await getDownloadURL(storageRef);
                console.log('File uploaded. Download URL:', downloadURL);  // Log URL
                
                // Save the file URL to Firestore using modular syntax
                try {
                    await addDoc(collection(db, 'policies'), { // Use addDoc with collection
                        name: file.name,
                        url: downloadURL,
                        createdAt: new Date(),
                    });
                    setMessage('File uploaded successfully!');
                } catch (error) {
                    console.error('Error saving file URL to Firestore:', error);
                    setMessage('Error saving file URL: ' + error.message);
                }

                setFile(null); // Reset the file input
            }
        );
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
            <h2>Upload Policy Document</h2>
            <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button>
      <div className="form-group">
            <input type="file" onChange={handleFileChange} />
            </div>
            <button className ="m-button" onClick={handleUpload}>Upload PDF</button>
            <p>{message}</p>
            
        </div>
        </div>
        </main>
        </>
    );
};

export default AdminUploadPDF;
