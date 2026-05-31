/**
 * PDF extraction utilities
 */
import pdfParse from 'pdf-parse';
import fs from 'fs';
import logger from './logger.js';

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    logger.error(`PDF extraction error: ${error.message}`);
    throw error;
  }
};

/**
 * Parse questions from extracted text
 * Basic pattern matching - can be enhanced with AI
 */
export const parseQuestionsFromText = (text) => {
  const questions = [];
  const questionPattern = /^\d+\.\s*(.+?)(?=\n(?:\d+\.|$))/gms;
  const optionPattern = /^\s*([A-D])\)\s*(.+?)$/gm;

  const matches = text.matchAll(questionPattern);

  for (const match of matches) {
    const questionText = match[1].trim();
    const questionBlock = match[0];
    const options = {};
    let correctAnswer = null;

    let optionMatch;
    while ((optionMatch = optionPattern.exec(questionBlock)) !== null) {
      const optionLetter = optionMatch[1];
      const optionText = optionMatch[2].trim();
      options[`option${optionLetter}`] = optionText;
    }

    if (Object.keys(options).length === 4) {
      questions.push({
        questionText,
        optionA: options.optionA || '',
        optionB: options.optionB || '',
        optionC: options.optionC || '',
        optionD: options.optionD || '',
        correctAnswer: correctAnswer,
        explanation: '',
        subject: '',
        topic: '',
        difficultyLevel: 'Medium',
      });
    }
  }

  return questions;
};

export default {
  extractTextFromPDF,
  parseQuestionsFromText,
};
