import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../firebase';
import { calTotalPoints } from '../utils';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import './GradeModal.css';

Modal.setAppElement('#root');

const GradeModal = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  existingGrade,
  isEditMode,
  uid,
}) => {
  console.log('Received uid in GradeModal:', uid);
  const [grade, setGrade] = useState('A');

  // モーダルが開かれたときに既存のグレードを設定
  useEffect(() => {
    if (isOpen) {
      if (existingGrade) {
        setGrade(existingGrade);
      } else {
        setGrade('A');
      }
    }
  }, [isOpen, existingGrade]);

  // スコアをFirestoreに保存する処理
  const handleSaveGrade = async () => {
    try {
      const dateKey = selectedDate.toISOString().split('T')[0];
      // ユーザーごとの scores コレクションを参照
      const scoreDocRef = doc(db, 'users', uid, 'scores', dateKey);

      // 前回のグレードを取得
      const scoreDoc = await getDoc(scoreDocRef);
      let previousGrade = null;

      if (scoreDoc.exists()) {
        previousGrade = scoreDoc.data().grade;
      }

      console.log('Previous Grade:', previousGrade);
      console.log('New Grade:', grade);

      // 新しいグレードを保存
      await setDoc(scoreDocRef, {
        date: selectedDate.toISOString(),
        grade: grade,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('New grade saved to Firestore.');

      // スコアを再取得
      const scoresData = {};
      const scoresCollection = collection(db, 'users', uid, 'scores');
      const querySnapshot = await getDocs(scoresCollection);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dateKey = new Date(data.date).toISOString().split('T')[0];
        scoresData[dateKey] = data.grade;
      });

      // 総ポイントを再計算
      const totalPoints = calTotalPoints(scoresData);

      // ユーザードキュメントを更新（totalPoints を更新）
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, { totalPoints: totalPoints }, { merge: true });
      console.log('Total points recalculated and updated:', totalPoints);

      // onSaveを呼び出す
      onSave();

      // モーダルを閉じる
      onClose();
    } catch (error) {
      console.error('An error occurred while updating the grade:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={isEditMode ? 'Edit Grade' : 'Add Grade'}
      className="grade-modal"
      overlayClassName="modal-overlay"
    >
      <div className="grade-modal-content">
        <h2>{isEditMode ? 'Edit Grade' : 'Add Grade'}</h2>
        <div className="grade-select-container">
          <label htmlFor="grade-select" className="grade-label">
            Choose Grade{' '}
          </label>
          <select
            className="grade-select"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="A">A</option>
            <option value="C">C</option>
            <option value="F">F</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSaveGrade}>Save</button>
      </div>
    </Modal>
  );
};

export default GradeModal;
