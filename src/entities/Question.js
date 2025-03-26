/**
 * Question entity class for managing question data, loading, and filtering
 */
import Papa from 'papaparse';
import { getActualImageFilename } from '@/utils/imageMapping';

class Question {
  /**
   * Get a list of all questions from CSV
   * @returns {Promise<Array>} - Array of question objects
   */
  static async list() {
    try {
      console.log("Loading questions from CSV");
      // In a real app, this would be an API call
      // For this demo, we'll load from the CSV included in the data folder
      
      const response = await fetch('/data/questions.csv');
      if (!response.ok) {
        throw new Error(`Failed to load questions CSV: ${response.status}`);
      }
      
      const csvText = await response.text();
      
      // Parse CSV using PapaParse
      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        // Basic transformation of the data
        transform: (value, column) => {
          // Convert boolean strings to actual booleans
          if (column === 'is_sample' && (value === 'true' || value === 'false')) {
            return value === 'true';
          }
          return value;
        }
      });
      
      if (parsed.errors && parsed.errors.length > 0) {
        console.error("CSV parsing errors:", parsed.errors);
      }
      
      console.log(`Loaded ${parsed.data.length} questions from CSV`);
      return parsed.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }
  
  /**
   * Get questions for a specific chapter
   * @param {string} chapter - Chapter number
   * @returns {Promise<Array>} - Array of question objects for the chapter
   */
  static async getByChapter(chapter) {
    try {
      console.log(`Loading questions for chapter ${chapter}`);
      
      // Try to fetch from chapter JSON file
      try {
        const response = await fetch(`/data/chapters/chapter${chapter}/questions.json`);
        if (response.ok) {
          const data = await response.json();
          console.log(`Loaded ${data.length} questions from chapter ${chapter} JSON`);
          return data;
        }
      } catch (jsonError) {
        console.warn(`Could not load chapter ${chapter} questions from JSON:`, jsonError);
      }
      
      // If JSON fetch fails, fall back to the CSV and filter by chapter
      const allQuestions = await this.list();
      const chapterQuestions = allQuestions.filter(q => q.chapter === chapter);
      console.log(`Filtered ${chapterQuestions.length} questions for chapter ${chapter} from CSV`);
      
      return chapterQuestions;
    } catch (error) {
      console.error(`Error fetching questions for chapter ${chapter}:`, error);
      return [];
    }
  }
  
  /**
   * Get questions by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} - Array of question objects for the category
   */
  static async getByCategory(category) {
    try {
      const allQuestions = await this.list();
      const categoryQuestions = allQuestions.filter(q => q.category === category);
      
      return categoryQuestions;
    } catch (error) {
      console.error(`Error fetching questions for category ${category}:`, error);
      return [];
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
   * Get a random set of questions
   * @param {number} count - Number of questions to get
   * @param {string} chapter - Optional chapter filter
   * @param {string} category - Optional category filter
   * @returns {Promise<Array>} - Array of random question objects
   */
  static async getRandom(count, chapter = null, category = null) {
    try {
      let questions;
      
      if (chapter) {
        questions = await this.getByChapter(chapter);
      } else {
        questions = await this.list();
      }
      
      if (category) {
        questions = questions.filter(q => q.category === category);
      }
      
      // Shuffle the questions
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      
      // Return the requested count or all if count is larger than available questions
      return shuffled.slice(0, Math.min(count, shuffled.length));
    } catch (error) {
      console.error('Error getting random questions:', error);
      return [];
    }
  }
}

export { Question };
