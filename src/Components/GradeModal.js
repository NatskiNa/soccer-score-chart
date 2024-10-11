import React, { useState } from 'react';
import Modal from 'react-modal';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './GradeModal.css';

Modal.setAppElement('#root');

const GradeModal = ({ isOpen, onClose, selectedDate, onSave }) => {
  const [grade, setGrade] = useState('A');

  // スコアをFirestoreに保存する処理
  const handleSaveGrade = async () => {
    try {
      await addDoc(collection(db, 'scores'), {
        date: selectedDate.toISOString(),
        grade: grade,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setGrade('A');
      onClose();
      onSave();
    } catch (error) {
      console.error('An error occurred while adding the score:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Grade"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Select Today's Grade</h2>
      <select value={grade} onChange={(e) => setGrade(e.target.value)}>
        <option value="A">A</option>
        <option value="C">C</option>
        <option value="F">F</option>
      </select>
      <button onClick={handleSaveGrade}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default GradeModal;
