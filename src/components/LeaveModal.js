import React, { useState } from 'react';
import Modal from 'react-modal';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import './LeaveModal.css';
import { IoMdClose } from "react-icons/io";
import Swal from 'sweetalert2';

Modal.setAppElement('#root'); // For accessibility

const LeaveModal = ({ isOpen, onRequestClose }) => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const user = useSelector((state) => state.auth.user);

  const handleApplyLeave = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (leaveType && startDate && endDate && reason) {
      try {
        const leaveRequestsCollection = collection(db, 'leaveRequests');
        await addDoc(leaveRequestsCollection, {
          userId: user.uid,
          displayName: user.displayName || 'Anonymous',
          leaveType,
          startDate,
          endDate,
          reason,
          status: 'Pending',
          appliedDate: new Date().toISOString(),
        });

        Swal.fire({
          title: 'Success!',
          text: 'Leave request submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        // Clear form fields after submission
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        onRequestClose(); // Close modal after submission
      } catch (error) {
        console.error('Error applying for leave:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error submitting your leave request.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Incomplete Fields!',
        text: 'Please fill in all fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Apply for Leave"
      className="modal"
      overlayClassName="overlay"
    >
      <button className="close-modal" onClick={onRequestClose}><IoMdClose /></button>
      <h2>Apply for Leave</h2>
      <form onSubmit={handleApplyLeave}>
        <div className="leave-container">
          <div className="form-group">
          <label>Leave Type:<sup>*</sup></label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="" disabled>Select leave type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
              <option value="CompOff Leave">CompOff Leave</option>
              <option value="Forgot to Mark Attendace">Forgot to Mark Attendace</option>
            </select>
          </div>
          <div className="date-group">
            <div className="form-group">
              <label>Start Date:<sup>*</sup></label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date:<sup>*</sup></label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Reason:<sup>*</sup></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        <div className="button-container">
          <button className="m-button-3 submit-btn" type="submit">
            Apply
          </button>
          <button className="m-button-4 submit-btn" type="button" onClick={onRequestClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default LeaveModal;
