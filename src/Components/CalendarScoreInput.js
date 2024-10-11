import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import 'react-calendar/dist/Calendar.css';
import './CalendarScoreInput.css';

const CalendarScoreInput = ({ fetchScores }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [grade, setGrade] = useState('A');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Pick a Date');
      return;
    }
    try {
      // Firestoreの「scores」コレクションに新しいスコアデータを追加
      await addDoc(collection(db, 'scores'), {
        date: selectedDate.toISOString(),
        grade: grade,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setGrade('A'); // Reset form to initial grade'A'
      fetchScores(); // スコアデータを再取得して表示を更新
    } catch (error) {
      console.error('An error occurred while adding the grade:', error);
    }
  };

  return (
    <div>
      <h1>Daily Goal Tracker</h1>
      <h2>Add your grade</h2>
      <Calendar
        onChange={setSelectedDate} // 日付が選択されたときに呼ばれる関数。選択された日付をstateにセット。
        value={selectedDate}
      />
      <form onSubmit={handleSubmit}>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="A">A</option>
          <option value="C">C</option>
          <option value="F">F</option>
        </select>
        <button type="submit">Add Score</button>
      </form>
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
