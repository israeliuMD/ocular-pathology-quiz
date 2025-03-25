/**
 * Create a URL for a page
 */
export function createPageUrl(page) {
  return `/${page.toLowerCase()}`;
}

/**
 * Parse category text to display name
 */
export function formatCategoryName(category) {
  if (!category) return '';
  
  // Replace underscores with spaces
  let formatted = category.replace(/_/g, ' ');
  
  // Capitalize first letter of each word
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get color class based on percentage value
 */
export function getPercentageColorClass(percentage) {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-blue-600";
  if (percentage >= 40) return "text-yellow-600";
  return "text-red-600";
}

/**
 * Convert a figure number string to a number for sorting
 */
export function parseFigureNumber(figureNumber) {
  if (!figureNumber) return 0;
  const numStr = figureNumber.replace(/[^0-9.-]+/g, "");
  return parseFloat(numStr) || 0;
}
