import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './UsePointModal.css';

Modal.setAppElement('#root');

const UsePointModal = ({ isOpen, onClose, points, onUsePoints }) => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const rewardOptions = [
    { name: 'Happy Lemon treat', cost: 5 },
    { name: 'Soccer Ball or a Pack of Soccer Cards', cost: 10 },
    { name: 'New Pair of Cleats', cost: 20 },
  ];

  // Resetting State Based on Modal Open/Close Status
  useEffect(() => {
    if (!isOpen) {
      setSelectedReward(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  // Select reward
  const handleSelectedReward = (reward) => {
    setSelectedReward(reward);
    setErrorMessage('');
  };

  // Point Redemption Logic
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

  // Close modal
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
      className="reward-modal"
      overlayClassName="modal-overlay"
    >
      <h2>Which reward would you like?</h2>
      {rewardOptions.map((reward) => (
        <div key={reward.name}>
          <button
            className="reward-button"
            onClick={() => handleSelectedReward(reward)}
            disabled={points < reward.cost}
          >
            {reward.name} - {reward.cost} points
          </button>
        </div>
      ))}

      {selectedReward && (
        <div className="reward-confirm">
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
