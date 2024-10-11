import React, { useState } from 'react';
import CalendarScoreInput from './Components/CalendarScoreInput';

const App = () => {
  const fetchScores = () => {
    // 実際にはFirebaseからデータを取得する関数ですが、
    // 現時点では仮の関数として定義しています
    console.log('Fetching scores...');
  };

  return (
    <div>
      <h1>サッカーポイントチャート</h1>
      <CalendarScoreInput fetchScores={fetchScores} />
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
