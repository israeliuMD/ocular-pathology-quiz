import Papa from 'papaparse';

/**
 * Question entity class for managing question data
 */
class Question {
  /**
   * Fetch all questions
   * @param {string} chapter - Optional chapter to filter questions
   * @returns {Promise<Array>} - Array of question objects
   */
  static async list(chapter = null) {
    try {
      // In a real application, this would be an API call
      // For now, we'll read from the CSV file
      const response = await fetch('/data/questions.csv');
      const csvData = await response.text();
      
      const result = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      if (result.errors && result.errors.length > 0) {
        console.error('CSV parsing errors:', result.errors);
      }
      
      // Filter by chapter if specified
      let questions = result.data;
      if (chapter) {
        questions = questions.filter(q => q.chapter === chapter);
      }
      
      // Fix boolean values (is_sample)
      questions = questions.map(q => ({
        ...q,
        is_sample: q.is_sample === 'true' || q.is_sample === true
      }));
      
      return questions;
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }
  
  /**
   * Fetch questions by chapter from JSON file
   * @param {string} chapterNumber - The chapter number
   * @returns {Promise<Array>} - Array of question objects
   */
  static async getByChapter(chapterNumber) {
    try {
      const response = await fetch(`/data/chapters/chapter${chapterNumber}/questions.json`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error loading questions for chapter ${chapterNumber}:`, error);
      return [];
    }
  }

  /**
   * Get a question by ID
   * @param {string} id - Question ID
   * @returns {Promise<Object|null>} - Question object or null if not found
   */
  static async getById(id) {
    try {
      const questions = await this.list();
      return questions.find(q => q.id === id) || null;
    } catch (error) {
      console.error('Error finding question:', error);
      return null;
    }
  }
  
  /**
   * Get image URL for a question based on chapter and figure number
   * @param {Object} question - Question object
   * @returns {string} - URL to the image
   */
  static getImageUrl(question) {
    if (!question || !question.figure_number) return '';
    
    const chapterNum = question.chapter || '1';
    const figureNum = question.figure_number.replace(/\s+/g, '_').toLowerCase();
    
    return `/data/chapters/chapter${chapterNum}/images/${figureNum}.jpg`;
  }
  
  /**
   * Format figures by difficulty
   * @param {Array} questions - Array of question objects
   * @returns {Object} - Object with questions grouped by difficulty
   */
  static groupByDifficulty(questions) {
    const result = {
      easy: [],
      medium: [],
      hard: []
    };
    
    questions.forEach(q => {
      const difficulty = q.difficulty || 'medium';
      if (result[difficulty]) {
        result[difficulty].push(q);
      } else {
        result.medium.push(q);
      }
    });
    
    return result;
  }
  
  /**
   * Group questions by category
   * @param {Array} questions - Array of question objects
   * @returns {Object} - Object with questions grouped by category
   */
  static groupByCategory(questions) {
    return questions.reduce((acc, question) => {
      const category = question.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(question);
      return acc;
    }, {});
  }
}

export { Question };
