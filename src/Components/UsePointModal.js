import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const UsePointModal = ({ isOpen, onClose, points, onUsePoints }) => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const rewardOptions = [
    { name: 'Happy Lemon treat', cost: 5 },
    { name: 'Soccer Ball or a pack of soccer cards', cost: 10 },
    { name: 'New pare of cleats', cost: 20 },
  ];

  // 報酬を選択する処理
  const handleSelectedReward = (reward) => {
    setSelectedReward(reward);
    setErrorMessage('');
  };

  // Confirm using the points
  const handleConfirmUse = () => {
    if (selectedReward && points >= selectedReward.cost) {
      onUsePoints(selectedReward.cost);
      setSelectedReward(null);
      onClose();
    } else {
      setErrorMessage(
        "You don't have enough points for rewards. Keep working!"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Use Your Points"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Which reward would you like?</h2>
      {rewardOptions.map((reward) => (
        <div key={reward.name}>
          <button onClick={() => handleSelectedReward(reward)}>
            {reward.name} - {reward.cost} points
          </button>
        </div>
      ))}

      {selectedReward && (
        <div>
          <p>
            Are you sure you want to use {selectedReward.cost} points for a
            {selectedReward.name}?
          </p>
          <button onClick={handleConfirmUse}>Yes</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </Modal>
  );
};

export default UsePointModal;
