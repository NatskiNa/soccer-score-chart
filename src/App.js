import React, { useEffect, useState } from 'react';
import CalendarScoreInput from './Components/CalendarScoreInput';
import Rewards from './Components/Rewards';
import UsePointModal from './Components/UsePointModal';
import ResetButton from './Components/ResetButton';
import './App.css';
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { getAuth, signInAnonymously } from 'firebase/auth';

const App = () => {
  const [count, setCount] = useState(0);
  const [isUsePointModalOpen, setIsUsePointModalOpen] = useState(false);
  const [uid, setUid] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);

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

  // Firestoreから初期データを取得し、リアルタイムで監視
  useEffect(() => {
    if (uid) {
      const userDocRef = doc(db, 'users', uid);

      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const total = userData.totalPoints || 0;
          const used = userData.usedPoints || 0;
          const availablePoints = total - used;

          setTotalPoints(total);
          setUsedPoints(used);
          setCount(availablePoints);

          console.log('Real-time totalPoints:', total);
          console.log('Real-time usedPoints:', used);
          console.log('Real-time count (availablePoints):', availablePoints);
        } else {
          // ドキュメントが存在しない場合、初期化
          setDoc(userDocRef, { totalPoints: 0, usedPoints: 0 });
          setTotalPoints(0);
          setUsedPoints(0);
          setCount(0);
          console.log('Initialized user document in Firestore');
        }
      });

      return () => unsubscribe();
    }
  }, [uid]);

  // ポイントを使用した場合の処理
  const handleUsePoints = async (usedCount, rewardName) => {
    if (count < usedCount) {
      console.log('Not enough points to use');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', uid);

      // usedPoints を更新
      const newUsedPoints = usedPoints + usedCount;
      await setDoc(userDocRef, { usedPoints: newUsedPoints }, { merge: true });
      console.log('Firestore updated with usedPoints:', newUsedPoints);

      // ローカルステートも更新
      setUsedPoints(newUsedPoints);
      setCount(totalPoints - newUsedPoints);

      // ポイント使用履歴を保存
      const historyCollectionRef = collection(db, 'users', uid, 'pointHistory');
      await addDoc(historyCollectionRef, {
        rewardName: rewardName,
        usedPoints: usedCount,
        date: new Date().toISOString(),
      });
      console.log('Point usage history saved.');
    } catch (error) {
      console.error('Failed to update usedPoints in Firebase:', error);
    }
  };

  // "Use Points"ボタンがクリックされたときにモーダルを開く
  const openUsePointsModal = () => {
    setIsUsePointModalOpen(true);
  };

  return (
    <div className="page-container">
      {uid ? (
        <>
          <h1>⚽️ POINT CHART ⚽️</h1>
          <Rewards points={count} onUsePointsClick={openUsePointsModal} />
          <CalendarScoreInput count={count} uid={uid} />
          <UsePointModal
            isOpen={isUsePointModalOpen}
            onClose={() => setIsUsePointModalOpen(false)}
            points={count}
            onUsePoints={handleUsePoints}
          />

          <ResetButton uid={uid} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
