import Papa from 'papaparse';
import { getActualImageFilename } from '@/utils/imageMapping';

/* ... [existing code] ... */

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
