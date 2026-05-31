/**
 * Calculate test results
 */
export const calculateResults = (answers, test) => {
  let totalMarks = test.totalQuestions * test.positiveMarks;
  let marksObtained = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalAttempted = 0;
  let totalUnattempted = test.totalQuestions - answers.length;

  const subjectAnalysis = {};
  const topicAnalysis = {};

  answers.forEach((answer) => {
    const question = answer.question;
    const isCorrect = answer.userAnswer === question.correctAnswer;

    if (isCorrect) {
      marksObtained += test.positiveMarks;
      totalCorrect++;
    } else if (answer.userAnswer) {
      marksObtained += test.negativeMark;
      totalIncorrect++;
    }

    if (answer.userAnswer) {
      totalAttempted++;
    }

    // Subject Analysis
    if (!subjectAnalysis[question.subject]) {
      subjectAnalysis[question.subject] = {
        subject: question.subject,
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        accuracy: 0,
        marksObtained: 0,
      };
    }

    subjectAnalysis[question.subject].totalQuestions++;
    if (answer.userAnswer) {
      subjectAnalysis[question.subject].attempted++;
      if (isCorrect) {
        subjectAnalysis[question.subject].correct++;
        subjectAnalysis[question.subject].marksObtained += test.positiveMarks;
      } else {
        subjectAnalysis[question.subject].marksObtained += test.negativeMark;
      }
    }

    // Topic Analysis
    if (!topicAnalysis[question.topic]) {
      topicAnalysis[question.topic] = {
        topic: question.topic,
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        accuracy: 0,
      };
    }

    topicAnalysis[question.topic].totalQuestions++;
    if (answer.userAnswer) {
      topicAnalysis[question.topic].attempted++;
      if (isCorrect) {
        topicAnalysis[question.topic].correct++;
      }
    }
  });

  // Calculate accuracy and percentages
  Object.values(subjectAnalysis).forEach((subject) => {
    if (subject.attempted > 0) {
      subject.accuracy = (subject.correct / subject.attempted) * 100;
    }
  });

  Object.values(topicAnalysis).forEach((topic) => {
    if (topic.attempted > 0) {
      topic.accuracy = (topic.correct / topic.attempted) * 100;
    }
  });

  const score = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;
  const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;

  return {
    totalMarks,
    marksObtained: Math.max(0, marksObtained),
    score: Math.max(0, score),
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    accuracy,
    subjectAnalysis: Object.values(subjectAnalysis),
    topicAnalysis: Object.values(topicAnalysis),
  };
};

/**
 * Calculate percentile
 */
export const calculatePercentile = async (score, testId, Result) => {
  try {
    const totalResults = await Result.countDocuments({ testId });
    const betterResults = await Result.countDocuments({
      testId,
      score: { $gt: score },
    });

    const percentile = totalResults > 0 ? ((totalResults - betterResults) / totalResults) * 100 : 0;
    return percentile;
  } catch (error) {
    console.error('Error calculating percentile:', error);
    return 0;
  }
};

/**
 * Calculate rank
 */
export const calculateRank = async (score, testId, Result) => {
  try {
    const betterResults = await Result.countDocuments({
      testId,
      score: { $gt: score },
    });

    return betterResults + 1;
  } catch (error) {
    console.error('Error calculating rank:', error);
    return null;
  }
};

export default {
  calculateResults,
  calculatePercentile,
  calculateRank,
};
