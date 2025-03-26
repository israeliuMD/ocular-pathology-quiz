// src/utils/imageMapping.js

/**
 * Map figure numbers to actual image filenames
 * 
 * This mapping connects the figure numbers referenced in the questions
 * to the actual image filenames in your project
 */
export const imageFilenameMap = {
  // Chapter 1 Figures
  "figure_1_1.jpg": "04-Ophthalmic Pathology and Intraocular Tumors_Page_028_Image_0001",
  
  // Figure 1-2 has parts A and B
  "figure_1_2.jpg": "04-Ophthalmic Pathology and Intraocular Tumors_Page_028_Image_0002",
  "figure_1_2_b.jpg": "04-Ophthalmic Pathology and Intraocular Tumors_Page_028_Image_0003",
  
  // Additional figures would be mapped here
  "figure_1_3.jpg": "04-Ophthalmic Pathology and Intraocular Tumors_Page_029_Image_0001", // Adjust this filename
  "figure_1_4.jpg": "04-Ophthalmic Pathology and Intraocular Tumors_Page_030_Image_0001", // Adjust this filename
  "figure_1_5.jpg": "04-Ophthalmic Pathology and Intraocular Tumors_Page_030_Image_0002", // Adjust this filename
  "figure_1_6.jpg": "04-Ophthalmic Pathology and Intraocular Tumors_Page_031_Image_0001", // Adjust this filename
};

/**
 * Get the actual filename for a given figure number
 * 
 * @param {string} figureNumber - The figure number (e.g., "1.1")
 * @returns {string} - The actual filename
 */
export function getActualImageFilename(figureNumber) {
  // Convert figure number format from "1.1" to "figure_1_1.jpg"
  const standardizedName = `figure_${figureNumber.replace(/\./g, '_')}.jpg`;
  
  // Get the actual filename from the map, or return the standardized name
  // if no mapping exists (as a fallback)
  const actualFilename = imageFilenameMap[standardizedName];
  
  // If we found a mapping, return the actual filename with .jpg extension
  // Otherwise return the standardized name as a fallback
  return actualFilename ? `${actualFilename}.jpg` : standardizedName;
}

/**
 * FOR IMPLEMENTATION:
 * 
 * 1. Replace the example filenames above with your actual filenames
 * 2. Make sure all figures referenced in questions.json have a corresponding entry
 * 3. For multi-part figures (like A, B, C), decide which part to use for the quiz
 *    or create separate entries if you want to reference specific parts
 * 4. Test the mapping by checking if Question.getImageUrl() returns the correct paths
 */
