import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const ConfettiEffect = ({ trigger, duration = 5000 }) => {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsRunning(true);
      setTimeout(() => {
        setIsRunning(false);
      }, duration);
    }
  }, [trigger, duration]);

  return isRunning ? <Confetti /> : null;
};

export default ConfettiEffect;
