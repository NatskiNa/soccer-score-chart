import React from 'react';

const PointDisplay = ({ points }) => {
  let message = '';

  if (points >= 20) {
    message = 'Amazing! You are doing great!';
  } else if (points >= 10) {
    message = 'Keep it up! Almost there!';
  } else if (points >= 5) {
    message = 'Nice work! Keep practicing!';
  } else {
    message = "Let's get started! Keep earning points!";
  }

  return (
    <div>
      <h3>Current Point: {points}</h3>
      <p>{message}</p>
    </div>
  );
};

export default PointDisplay;

// 役割:
// 現在の合計ポイントを視覚的に表示。
// モチベーションを上げるためのメッセージやアニメーションを追加。

// 主な能:
// 合計ポイントの表示。
// 進捗バーや円グラフで視覚的に表現（必要に応じて）。
// ポイントに応じたメッセージの表示。
