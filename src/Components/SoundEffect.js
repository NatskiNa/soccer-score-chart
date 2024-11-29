import { useEffect } from 'react';
import { Howl } from 'howler';
import rewardSound from './assets/reward.mp3';

const SoundEffect = ({ soundFile, playTrigger }) => {
  useEffect(() => {
    if (playTrigger) {
      const sound = new Howl({ src: [rewardSound] });
      sound.play();
    }
  }, [playTrigger]);

  return null;
};

export default SoundEffect;
