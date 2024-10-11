import React from 'react';

const PointDisplay = ({ points }) => {
  return <h3>Current Point: {points} </h3>;
};

export default PointDisplay;

// 役割:
// 現在の合計ポイントを視覚的に表示。
// モチベーションを上げるためのメッセージやアニメーションを追加。

// 主な能:
// 合計ポイントの表示。
// 進捗バーや円グラフで視覚的に表現（必要に応じて）。
// ポイントに応じたメッセージの表示。
