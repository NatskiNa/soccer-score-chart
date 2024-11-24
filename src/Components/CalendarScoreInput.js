import React, { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'react-calendar/dist/Calendar.css';
import './CalendarScoreInput.css';
import GradeModal from './GradeModal';
import PointHistoryModal from './PointHistoryModal';
import { calTotalPoints } from '../utils';

const CalendarScoreInput = ({ count, uid }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [scores, setScores] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModal] = useState(false);

  const openHistoryModal = () => {
    setIsHistoryModal(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModal(false);
  };

  // Firestoreからスコアデータを取得し、表示用に保存する関数
  const fetchScores = useCallback(async () => {
    try {
      const scoresCollection = collection(db, 'users', uid, 'scores');
      const querySnapshot = await getDocs(scoresCollection);
      const scoresData = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateKey = new Date(data.date).toISOString().split('T')[0];
        scoresData[dateKey] = data.grade;
      });

      setScores(scoresData); // ステートを更新

      // Calculate total points and update State
      const points = calTotalPoints(scoresData);
      // setTotalPoints(points);
      console.log('Total Points:', points);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  }, [uid]);

  // コンポーネントのマウント時にスコアを取得
  useEffect(() => {
    if (uid) {
      fetchScores();
    }
  }, [uid, fetchScores]);

  // モーダルを開くときの処理。選択された日付とグレードをstateに保存し、モーダルを表示
  const openModal = (date) => {
    setSelectedDate(date);
    const dateKey = date.toISOString().split('T')[0];
    const existingGrade = scores[dateKey] || null;
    setSelectedGrade(existingGrade);
    setIsModalOpen(true);
  };

  // モーダルを閉じる処理
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGrade(null);
  };

  // グレードを保存した後にスコアを再取得
  const handleSaveGrade = () => {
    fetchScores();
    closeModal();
  };

  return (
    <div className="calendar-section">
      <h2>Add or Edit your grade</h2>
      <Calendar
        onClickDay={openModal}
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const dateKey = date.toISOString().split('T')[0];
            const grade = scores[dateKey];

            return (
              <div className="grade-tile">
                {grade ? <p className="grade-display">{grade}</p> : null}
              </div>
            );
          }
        }}
      />

      {/* Aの合計数の表示 */}
      <div className="points-display">
        <h3>Your current A count is: {count}</h3>
      </div>

      {/* モーダルの表示 */}
      <GradeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedDate={selectedDate}
        onSave={handleSaveGrade}
        existingGrade={selectedGrade}
        isEditMode={selectedGrade !== null}
        uid={uid}
      />
      <button className="point-history-btn" onClick={openHistoryModal}>
        Point Usage History
      </button>
      <PointHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={closeHistoryModal}
        uid={uid}
      />
    </div>
  );
};

export default CalendarScoreInput;
