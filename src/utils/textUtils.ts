/**
 * Utility function to strip HTML tags from text and convert to plain text
 * @param html - HTML string to clean
 * @returns Plain text string
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get text content and clean it up
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // Replace multiple spaces and newlines with single spaces
  return textContent.replace(/\s+/g, ' ').trim();
};