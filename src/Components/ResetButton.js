import React from 'react';
import '../App.css';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';

const ResetButton = ({ uid }) => {
  const handleReset = async () => {
    if (
      window.confirm(
        '全てのデータをリセットしますか？この操作は取り消せません。'
      )
    ) {
      try {
        // ユーザーごとの scores サブコレクションを参照
        const scoresCollection = collection(db, 'users', uid, 'scores');
        const querySnapshot = await getDocs(scoresCollection);

        // 全てのドキュメントを削除
        const deletePromises = [];
        querySnapshot.forEach((docSnapshot) => {
          deletePromises.push(
            deleteDoc(doc(db, 'users', uid, 'scores', docSnapshot.id))
          );
        });

        await Promise.all(deletePromises);

        // ユーザーの totalPoints と usedPoints をリセット
        const userDocRef = doc(db, 'users', uid);
        await setDoc(
          userDocRef,
          { totalPoints: 0, usedPoints: 0 },
          { merge: true }
        );

        alert('データがリセットされました。');
      } catch (error) {
        console.error('データのリセット中にエラーが発生しました：', error);
      }
    }
  };

  return (
    <button className="reset-btn" onClick={handleReset}>
      Reset grade data
    </button>
  );
};

export default ResetButton;
