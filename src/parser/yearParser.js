// ===============================
// Extract years of experience
// ===============================
function extractYearsOfExperience(text) {
  if (!text) return null;

  const sentences = text.split(/[\n\.!?]+/);

  // Patterns:
  // 1️⃣ Range (1-3 years or 1 to 3 years)
  // 2️⃣ Single numeric (3+ years)
  // 3️⃣ Word + (3) years → Three (3) years
  const yearsPattern =
  /(\d+)\s*(?:[\-\u2013\u2014]|to)\s*(\d+)\s*(?:years?|yrs?)|\b(\d+)(\+)?\s*(?:years?|yrs?)\b|\b[A-Za-z]+\s*\((\d+)\)\s*(?:years?|yrs?)\b/i;
  const experienceIndicator =
    /\b(experience|exp|professional|industry|background|hands[-\s]?on|development)\b/i;

  let maxYears = null;
  let displayValue = null;

  for (const sentence of sentences) {
    if (!experienceIndicator.test(sentence)) continue;

    const match = sentence.match(yearsPattern);
    if (!match) continue;

    let extractedYears;
    let formatted;

    // ✅ Case 1: Range (1-3 years)
    if (match[1] && match[2]) {
      const low = parseInt(match[1], 10);
      const high = parseInt(match[2], 10);

      extractedYears = high;
      formatted = `${low}-${high}`;
    }

    // ✅ Case 2: Single numeric (3 or 3+ years)
    else if (match[3]) {
      extractedYears = parseInt(match[3], 10);
      formatted = match[4] ? `${match[3]}+` : `${match[3]}`;
    }

    // ✅ Case 3: WordNumber (3) years
    else if (match[5]) {
      extractedYears = parseInt(match[5], 10);
      formatted = `${match[5]}`;
    }

    if (extractedYears != null) {
      if (maxYears == null || extractedYears > maxYears) {
        maxYears = extractedYears;
        displayValue = formatted;
      }
    }
  }

  if (maxYears == null) return null;

  return displayValue;
}

export default extractYearsOfExperience;