// PointHistory.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const PointHistory = ({ uid }) => {
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
    <div>
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
    </div>
  );
};

export default PointHistory;
