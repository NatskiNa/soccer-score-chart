import React, { useState } from 'react';
import CalendarScoreInput from './Components/CalendarScoreInput';
import Rewards from './Components/Rewards';

const App = () => {
  const [points, setPoints] = useState(0);

  // カレンダーから取得したポイントを更新するための関数
  const updatePoints = (newPoints) => {
    setPoints(newPoints);
  };

  return (
    <div>
      <h1>Soccer Point Chart</h1>

      {/* ポイントに応じた報酬を表示するコンポーネント */}
      <Rewards points={points} />
      {/* カレンダーコンポーネントに、ポイントを更新する関数を渡す */}
      <CalendarScoreInput updatePoints={updatePoints} />
    </div>
  );
};

export default App;

// 役割:
// アプリ全体の状態（スコアデータ、合計ポイント）を管理。
// 他のコンポーネントに必要なデータや関数を渡す。
// 主な機能:
// scores オブジェクトを状態として保持。日付をキー、スコアを値とする。
// points を計算し、状態として保持。
// 必要なコンポーネントに scores、setScores、points を渡す。
