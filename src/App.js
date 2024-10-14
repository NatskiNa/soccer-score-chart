import React, { useState } from 'react';
import CalendarScoreInput from './Components/CalendarScoreInput';
import Rewards from './Components/Rewards';
import UsePointModal from './Components/UsePointModal';

const App = () => {
  const [points, setPoints] = useState(0);
  const [isUsePointModalOpen, setIsUsePointModalOpen] = useState(false);

  // ポイントを更新するための関数
  const updatePoints = (newPoints) => {
    console.log('Updating points:', newPoints);
    setPoints(newPoints);
  };

  // ポイントを使用した場合の処理
  const handleUsePoints = (usedPoints) => {
    const updatedPoints = points - usedPoints;

    console.log('Points after using:', updatedPoints); // デバッグ用
    setPoints(updatedPoints);
  };

  // "Use Points"ボタンがクリックされたときにモーダルを開く
  const openUsePointsModal = () => {
    setIsUsePointModalOpen(true);
  };

  return (
    <div>
      <h1>Soccer Point Chart</h1>

      {/* ポイントに応じた報酬を表示するコンポーネント */}
      <Rewards points={points} onUsePointsClick={openUsePointsModal} />

      {/* カレンダーでポイントを管理 */}
      <CalendarScoreInput updatePoints={updatePoints} points={points} />

      {/* ポイントを使用するためのモーダル */}
      <UsePointModal
        isOpen={isUsePointModalOpen}
        onClose={() => setIsUsePointModalOpen(false)}
        points={points}
        onUsePoints={handleUsePoints}
      />
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
