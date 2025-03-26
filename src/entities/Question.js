import Papa from 'papaparse';
import { getActualImageFilename } from '@/utils/imageMapping';

/**
 * Question entity class for managing questions data and operations
 */
class Question {
  /**
   * Get all questions
   * @returns {Promise<Array>} - Array of question objects
   */
  static async list() {
    try {
      // In a real app, this would be an API call to fetch questions
      // For now, we'll use the CSV data
      const response = await fetch('/data/questions.csv');
      const csvText = await response.text();
      
      const results = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });
      
      return results.data;
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }
  
  /**
   * Get questions for a specific chapter
   * @param {string} chapter - Chapter number
   * @returns {Promise<Array>} - Array of question objects
   */
  static async getByChapter(chapter) {
    try {
      // In a real app, this would be filtered on the server
      // For now, we'll fetch the JSON file for the chapter
      const response = await fetch(`/data/chapters/chapter${chapter}/questions.json`);
      const questions = await response.json();
      
      return questions;
    } catch (error) {
      console.error(`Error loading questions for chapter ${chapter}:`, error);
      
      // Fallback to the CSV and filter by chapter
      try {
        const allQuestions = await this.list();
        return allQuestions.filter(q => q.chapter === chapter);
      } catch (fallbackError) {
        console.error('Error with fallback loading:', fallbackError);
        return [];
      }
    }
  }
  
  /**
   * Get image URL for a question based on chapter and figure number
   * @param {Object} question - Question object
   * @returns {string} - URL to the image
   */
  static getImageUrl(question) {
    if (!question) return '/api/placeholder/400/300';
    
    // If question has a complete image URL that starts with http, use that
    if (question.image_url && question.image_url.startsWith('http')) {
      return question.image_url;
    }
    
    // If question has an image_url that's not http but not empty, use that
    if (question.image_url && question.image_url.trim() !== '') {
      // Check if it's a relative URL
      if (question.image_url.startsWith('/')) {
        return question.image_url;
      }
      return `/${question.image_url}`;
    }
    
    // Otherwise construct URL from figure number
    if (question.figure_number) {
      const chapterNum = question.chapter || '1';
      const actualFilename = getActualImageFilename(question.figure_number);
      
      return `/data/chapters/chapter${chapterNum}/images/${actualFilename}`;
    }
    
    // Fallback to placeholder
    return '/api/placeholder/400/300';
  }
  
  /**
   * Get questions by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} - Array of question objects
   */
  static async getByCategory(category) {
    try {
      const allQuestions = await this.list();
      return allQuestions.filter(q => q.category === category);
    } catch (error) {
      console.error(`Error loading questions for category ${category}:`, error);
      return [];
    }
  }
  
  /**
   * Get random questions
   * @param {number} count - Number of questions to get
   * @param {string} chapter - Optional chapter filter
   * @returns {Promise<Array>} - Array of question objects
   */
  static async getRandom(count, chapter) {
    try {
      let questions;
      
      if (chapter) {
        questions = await this.getByChapter(chapter);
      } else {
        questions = await this.list();
      }
      
      // Shuffle and limit
      return [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
    } catch (error) {
      console.error('Error getting random questions:', error);
      return [];
    }
  }
}

export { Question };
