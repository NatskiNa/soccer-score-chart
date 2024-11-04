import React from 'react';

const Rewards = ({ points, onUsePointsClick }) => {
  let rewardMessage = '';

  // デバッグ用にpointsの値を出力
  console.log('Current points in Rewards:', points);

  if (points >= 20) {
    rewardMessage = 'Congrats! You have earned a new pair of cleats!';
  } else if (points >= 10) {
    rewardMessage =
      'Great job! you can choose between a soccer ball or a pack of soccer cards!';
  } else if (points >= 5) {
    rewardMessage = 'Awesome! You have earned a treat at Happy Lemon!';
  } else {
    rewardMessage = 'Keep practicing! Earn more points to unlock rewards.';
  }

  return (
    <div>
      <h2>Your Rewards</h2>
      <p>{rewardMessage}</p>

      <button onClick={onUsePointsClick} disabled={points < 5}>
        Use Points
      </button>
    </div>
  );
};

export default Rewards;
