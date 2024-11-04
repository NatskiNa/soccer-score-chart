import React, { useEffect, useState } from 'react';
import CalendarScoreInput from './Components/CalendarScoreInput';
import Rewards from './Components/Rewards';
import UsePointModal from './Components/UsePointModal';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { getAuth, signInAnonymously } from 'firebase/auth';

const App = () => {
  const [count, setCount] = useState(0);
  const [isUsePointModalOpen, setIsUsePointModalOpen] = useState(false);
  const [uid, setUid] = useState(null);

  // Firebase Authenticationでユーザーを認証
  useEffect(() => {
    const auth = getAuth();

    signInAnonymously(auth)
      .then(() => {
        const user = auth.currentUser;
        setUid(user.uid);
        console.log('User signed in anonymously with UID:', user.uid);
      })
      .catch((error) => {
        console.error('Error signing in anonymously:', error);
      });
  }, []);

  // Firestoreから初期カウントを取得し、リアルタイムで監視
  useEffect(() => {
    if (uid) {
      const userDocRef = doc(db, 'users', uid);

      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setCount(userData.count || 0);
          console.log('Real-time count update:', userData.count || 0);
        } else {
          // ドキュメントが存在しない場合、0で初期化
          setDoc(userDocRef, { count: 0 });
          setCount(0);
          console.log('Initialized count to 0 in Firestore');
        }
      });

      return () => unsubscribe();
    }
  }, [uid]);

  // ポイントを使用した場合の処理
  const handleUsePoints = async (usedCount) => {
    const updatedCount = count - usedCount;

    if (updatedCount < 0) {
      console.log('Not enough points to use');
      return;
    }

    console.log('Count after using:', updatedCount);

    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, { count: updatedCount }, { merge: true });
      console.log('Firestore updated with count:', updatedCount);
    } catch (error) {
      console.error('Failed to update count in Firebase:', error);
    }
  };

  // "Use Points"ボタンがクリックされたときにモーダルを開く
  const openUsePointsModal = () => {
    setIsUsePointModalOpen(true);
  };

  return (
    <div>
      {uid ? (
        <>
          <h1>Soccer Point Chart</h1>
          <Rewards points={count} onUsePointsClick={openUsePointsModal} />
          <CalendarScoreInput count={count} uid={uid} />
          <UsePointModal
            isOpen={isUsePointModalOpen}
            onClose={() => setIsUsePointModalOpen(false)}
            points={count}
            onUsePoints={handleUsePoints}
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
