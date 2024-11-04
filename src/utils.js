export const calTotalPoints = (scores) => {
  let totalPoints = 0;
  const gradeToValue = (grade) => {
    if (grade === 'A') return 1;
    if (grade === 'C') return 0;
    if (grade === 'F') return -1;
    return 0;
  };
  Object.values(scores).forEach((grade) => {
    totalPoints += gradeToValue(grade);
  });
  return totalPoints;
};
