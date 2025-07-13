/**
 * Utility function to strip HTML tags and markdown from text and convert to plain text
 * @param content - HTML or markdown string to clean
 * @returns Plain text string
 */
export const stripHtmlTags = (content: string): string => {
  if (!content) return '';
  
  // First, strip markdown formatting
  let cleanText = content
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1');
  
  // Then, create a temporary div element to parse any remaining HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cleanText;
  
  // Get text content and clean it up
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // Replace multiple spaces and newlines with single spaces
  return textContent.replace(/\s+/g, ' ').trim();
};