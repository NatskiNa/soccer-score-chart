import React, { useEffect, useState } from 'react';
import './PointHistoryModal.css';
import Modal from 'react-modal';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

Modal.setAppElement('#root');

const PointHistoryModal = ({ uid, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyCollection = collection(db, 'users', uid, 'pointHistory');
        const q = query(historyCollection, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const historyData = [];
        querySnapshot.forEach((doc) => {
          historyData.push(doc.data());
        });
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching point history:', error);
      }
    };

    if (uid) {
      fetchHistory();
    }
  }, [uid]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Point Usage History"
      className="history-modal"
      overlayClassName="modal-overlay"
    >
      <h2>Point Usage History</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              Date: {new Date(entry.date).toLocaleDateString()} - Reward:{' '}
              {entry.rewardName} - Points Used: {entry.usedPoints}
            </li>
          ))}
        </ul>
      ) : (
        <p>No point usage history available.</p>
      )}
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default PointHistoryModal;
