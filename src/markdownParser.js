/**
 * Parse the canonical Markdown format for questions.
 * Separates question body, answer, code blocks, analogies, and key points.
 */
export function parseMarkdown(text) {
  const result = {
    question: '',
    answer: '',
    code: '',
    analogy: '',
    keyPoints: ''
  };
  const cleanText = text.replace(/^---[\s\S]*?---\s*/m, '').trim();
  const parts = cleanText.split('---ANSWER---');
  result.question = parts[0] ? parts[0].trim() : '';
  let rawAnswer = parts[1] ? parts[1].trim() : '';
  const codeMatch =
    rawAnswer.match(/```java\s*\n([\s\S]*?)\n```/i) ||
    result.question.match(/```java\s*\n([\s\S]*?)\n```/i);
  if (codeMatch) result.code = codeMatch[1];

  // Extract Analogy
  const analogyMatch = rawAnswer.match(
    /###?\s*(?:Life\s+|Real-World\s+|Intuitive\s+)?[^\n]*Analogy[^\n]*\n([\s\S]*?)(?=###?|$)/i
  );
  if (analogyMatch) {
    result.analogy = analogyMatch[1].trim();
    rawAnswer = rawAnswer.replace(analogyMatch[0], '');
  }

  // Extract Key Points
  const keyPointsMatch = rawAnswer.match(/###\s*Key Points\s*\n([\s\S]*?)(?=###|$)/i);
  if (keyPointsMatch) {
    result.keyPoints = keyPointsMatch[1].trim();
    rawAnswer = rawAnswer.replace(keyPointsMatch[0], '');
  }
  result.answer = rawAnswer.trim();
  return result;
}
