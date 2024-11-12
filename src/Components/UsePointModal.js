import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const UsePointModal = ({ isOpen, onClose, points, onUsePoints }) => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const rewardOptions = [
    { name: 'Happy Lemon treat', cost: 5 },
    { name: 'Soccer Ball or a Pack of Soccer Cards', cost: 10 },
    { name: 'New Pair of Cleats', cost: 20 },
  ];

  // モーダルの開閉に応じて状態をリセット
  useEffect(() => {
    if (!isOpen) {
      setSelectedReward(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  // 報酬を選択する処理
  const handleSelectedReward = (reward) => {
    setSelectedReward(reward);
    setErrorMessage('');
  };

  // ポイントを使用する処理
  const handleConfirmUse = () => {
    if (selectedReward && points >= selectedReward.cost) {
      onUsePoints(selectedReward.cost, selectedReward.name);
      setSelectedReward(null);
      onClose();
    } else {
      setErrorMessage(
        "You don't have enough points for rewards. Keep working!"
      );
    }
  };

  // モーダルを閉じる処理
  const handleClose = () => {
    setSelectedReward(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Use Your Points"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Which reward would you like?</h2>
      {rewardOptions.map((reward) => (
        <div key={reward.name}>
          <button
            onClick={() => handleSelectedReward(reward)}
            disabled={points < reward.cost}
          >
            {reward.name} - {reward.cost} points
          </button>
        </div>
      ))}

      {selectedReward && (
        <div>
          <p>
            Are you sure you want to use {selectedReward.cost} points for a{' '}
            {selectedReward.name}?
          </p>
          <button onClick={handleConfirmUse}>Yes</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </Modal>
  );
};

export default UsePointModal;
