import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'react-calendar/dist/Calendar.css';
import './CalendarScoreInput.css';
import GradeModal from './GradeModal';

const CalendarScoreInput = ({ updatePoints }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scores, setScores] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  // Firestoreからスコアデータを取得し、ポイントを計算する関数
  const fetchScores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'scores'));
      const scoresData = {};
      let points = 0; // initialize total points

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateKey = new Date(data.date).toISOString().split('T')[0];
        scoresData[dateKey] = data.grade;

        // 各スコアに基づいてポイントを計算
        if (data.grade === 'A') {
          points += 2;
        } else if (data.grade === 'C') {
          points += 0;
        } else if (data.grade === 'F') {
          points -= 2;
        }
      });

      setScores(scoresData); // 取得したデータをstateに保存
      setTotalPoints(points); // update total points
      updatePoints(points); // 親コンポーネントにポイントを更新
    } catch (error) {
      console.error('An error occurred while receiving the score:', error);
    }
  };

  // コンポーネントの初回マウント時にスコアを取得
  useEffect(() => {
    fetchScores();
  }, []);

  // モーダルを開くときの処理。選択された日付をstateに保存し、モーダルを表示。
  const openModal = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Add your grade</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date, view }) => {
          if (view === 'month') {
            const dateKey = date.toISOString().split('T')[0];
            const grade = scores[dateKey];
            return (
              <div onClick={() => openModal(date)} className="grade-tile">
                {grade ? <p className="grade-display">{grade}</p> : <p>Add</p>}
              </div>
            );
          }
        }}
      />

      {/* 合計ポイントの表示 */}
      <div className="points-display">
        <h3>Your current point is: {totalPoints}</h3>
      </div>

      {/* モーダルの表示 */}
      <GradeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedDate={selectedDate}
        onSave={fetchScores}
      />
    </div>
  );
};

export default CalendarScoreInput;

// 役割:
// カレンダーを表示し、日付をタップするとモーダルでその日のスコアを入力。
// 入力されたスコアを親コンポーネント（App.js）に渡す。

// 主な機能:
// カレンダーの表示（react-calendar を使用）。
// 日付をクリックしたときのモーダル表示とスコア入力。
// スコアの表示（カレンダー内にアイコンや色を適用）。
