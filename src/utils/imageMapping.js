// src/utils/imageMapping.js

/**
 * Map your actual image filenames to the expected ones
 * 
 * Instructions:
 * 1. Replace the values with your actual filenames
 * 2. Keep the keys as they are (they match the figure numbers)
 */
export const imageFilenameMap = {
  // For Chapter 1
  "figure_1_1.jpg": "your-actual-filename-for-1-1.jpg",
  "figure_1_2.jpg": "your-actual-filename-for-1-2.jpg",
  "figure_1_3.jpg": "your-actual-filename-for-1-3.jpg",
  "figure_1_4.jpg": "your-actual-filename-for-1-4.jpg",
  "figure_1_5.jpg": "your-actual-filename-for-1-5.jpg",
  "figure_1_6.jpg": "your-actual-filename-for-1-6.jpg",
  
  // Add more mappings here as needed
};

/**
 * Get the actual filename for a given figure number
 */
export function getActualImageFilename(figureNumber) {
  const standardizedName = `figure_${figureNumber.replace(/\./g, '_')}.jpg`;
  return imageFilenameMap[standardizedName] || standardizedName;
}
