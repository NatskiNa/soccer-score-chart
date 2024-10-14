import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'react-calendar/dist/Calendar.css';
import './CalendarScoreInput.css';
import GradeModal from './GradeModal';

const CalendarScoreInput = ({ updatePoints, points }) => {
  console.log('Current points in CalendarScoreInput:', points);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scores, setScores] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Firestoreからスコアデータを取得し、ポイントを計算する関数
  const fetchScores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'scores'));
      const scoresData = {};
      let totalPoints = 0; // Initialize total points

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateKey = new Date(data.date).toISOString().split('T')[0];
        scoresData[dateKey] = data.grade;

        // 各スコアに基づいてポイントを計算
        if (data.grade === 'A') {
          totalPoints += 1;
        } else if (data.grade === 'C') {
          totalPoints += 0;
        } else if (data.grade === 'F') {
          totalPoints -= 1;
        }
      });

      setScores(scoresData); // 取得したデータをstateに保存
      updatePoints(totalPoints); // 親コンポーネントにポイントを更新
    } catch (error) {
      console.error('An error occurred while receiving the score:', error);
    }
  }; // useCallbackで依存配列にupdatePointsを追加

  // コンポーネントの初回マウント時にスコアを取得
  useEffect(() => {
    fetchScores();
  }, []); // fetchScores を依存配列に追加

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
        <h3>Your current point is: {points}</h3>
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
