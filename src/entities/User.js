/**
 * User entity class for managing user data, progress, and quiz results
 */
class User {
  /**
   * Get the current user data
   * @returns {Promise<Object>} - User data object
   */
  static async me() {
    try {
      // In a real application, this would be an API call
      // For now, we'll use localStorage
      const userData = localStorage.getItem('user_data');
      
      if (userData) {
        return JSON.parse(userData);
      }
      
      // If no user data exists, create a new user profile
      const newUser = {
        id: 'user_' + Date.now(),
        quiz_scores: [],
        categories_progress: {
          developmental_anomaly: { correct: 0, total: 0 },
          inflammation: { correct: 0, total: 0 },
          dystrophy_and_degeneration: { correct: 0, total: 0 },
          neoplasia: { correct: 0, total: 0 }
        },
        chapter_progress: {},
        total_questions_attempted: 0,
        total_correct: 0,
        created_at: new Date().toISOString()
      };
      
      // Save the new user profile
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  
  /**
   * Save quiz results
   * @param {Object} results - Quiz results object
   * @returns {Promise<boolean>} - Success status
   */
  static async saveQuizResults(results) {
    try {
      const user = await this.me();
      
      if (!user) return false;
      
      // Add the new quiz score
      user.quiz_scores.push({
        date: new Date().toISOString(),
        score: results.percentage,
        total_questions: results.total,
        correct: results.correct,
        chapter: results.chapter || '1'
      });
      
      // Update category progress
      results.categoryResults.forEach(cat => {
        if (!user.categories_progress[cat.category]) {
          user.categories_progress[cat.category] = { correct: 0, total: 0 };
        }
        
        user.categories_progress[cat.category].correct += cat.correct;
        user.categories_progress[cat.category].total += cat.total;
      });
      
      // Update chapter progress
      const chapter = results.chapter || '1';
      if (!user.chapter_progress[chapter]) {
        user.chapter_progress[chapter] = { correct: 0, total: 0 };
      }
      user.chapter_progress[chapter].correct += results.correct;
      user.chapter_progress[chapter].total += results.total;
      
      // Update totals
      user.total_questions_attempted += results.total;
      user.total_correct += results.correct;
      
      // Save updated user data
      localStorage.setItem('user_data', JSON.stringify(user));
      
      return true;
    } catch (error) {
      console.error('Error saving quiz results:', error);
      return false;
    }
  }
  
  /**
   * Get quiz history for a specific chapter
   * @param {string} chapter - Chapter number
   * @returns {Promise<Array>} - Array of quiz score objects for the chapter
   */
  static async getChapterQuizHistory(chapter) {
    try {
      const user = await this.me();
      
      if (!user || !user.quiz_scores) return [];
      
      return user.quiz_scores.filter(quiz => quiz.chapter === chapter);
    } catch (error) {
      console.error('Error fetching chapter quiz history:', error);
      return [];
    }
  }
  
  /**
   * Get overall progress for a specific chapter
   * @param {string} chapter - Chapter number
   * @returns {Promise<Object>} - Chapter progress object
   */
  static async getChapterProgress(chapter) {
    try {
      const user = await this.me();
      
      if (!user || !user.chapter_progress || !user.chapter_progress[chapter]) {
        return { correct: 0, total: 0, percentage: 0 };
      }
      
      const progress = user.chapter_progress[chapter];
      const percentage = progress.total > 0 
        ? Math.round((progress.correct / progress.total) * 100) 
        : 0;
      
      return {
        ...progress,
        percentage
      };
    } catch (error) {
      console.error('Error fetching chapter progress:', error);
      return { correct: 0, total: 0, percentage: 0 };
    }
  }
  
  /**
   * Reset user progress
   * @returns {Promise<boolean>} - Success status
   */
  static async resetProgress() {
    try {
      const user = await this.me();
      
      if (!user) return false;
      
      // Reset all progress
      user.quiz_scores = [];
      user.categories_progress = {
        developmental_anomaly: { correct: 0, total: 0 },
        inflammation: { correct: 0, total: 0 },
        dystrophy_and_degeneration: { correct: 0, total: 0 },
        neoplasia: { correct: 0, total: 0 }
      };
      user.chapter_progress = {};
      user.total_questions_attempted = 0;
      user.total_correct = 0;
      
      // Save updated user data
      localStorage.setItem('user_data', JSON.stringify(user));
      
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  }
}

export { User };
