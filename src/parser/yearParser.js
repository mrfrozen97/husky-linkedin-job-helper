// ===============================
// Extract years
// ===============================
function extractYearsOfExperience(text) {
  const sentenceRegex = /[^.!?]*\d+\+?\s*(?:years?|yrs?)[^.!?]*/gi;
  const yearRegex = /(\d+)\+?\s*(?:years?|yrs?)/i;

  const sentenceMatches = text.match(sentenceRegex);

  if (!sentenceMatches) return null;

  let maxYears = null;

  sentenceMatches.forEach(sentence => {
    const yearMatch = sentence.match(yearRegex);
    if (yearMatch) {
      const years = parseInt(yearMatch[1]);

      console.log("📌 Found sentence:", sentence.trim());
      console.log("➡ Years extracted from this sentence:", years);

      if (!maxYears || years > maxYears) {
        maxYears = years;
      }
    }
  });

  return maxYears;
}

export default extractYearsOfExperience;