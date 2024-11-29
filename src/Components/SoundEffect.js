import { useEffect } from 'react';
import { Howl } from 'howler';

const SoundEffect = ({ soundFile, playTrigger }) => {
  useEffect(() => {
    if (playTrigger) {
      const sound = new Howl({ src: [soundFile] });
      sound.play();
    }
  }, [playTrigger, soundFile]);

  return null;
};

export default SoundEffect;
