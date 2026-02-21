export function extractVisaStatus(text) {
  if (!text) {
    return { status: "unknown", sentence: null };
  }

  const patterns = {
    noSponsor: [
      /not sponsor/i,
      /unable to sponsor/i,
      /without sponsorship/i,
      /\b(no|not\s+eligible\s+for)\s+(work\s+)?visa\s+sponsorship\b/i,
      /\bno\s+(visa\s+)?sponsor(ship|ed|ing)?\b|\bwithout\s+(visa\s+)?sponsor(ship|ed|ing)?\b|\bwe\s+do\s+not\s+sponsor\b|\b(visa\s+)?sponsor(ship|ed|ing)?\b[\s\S]{0,20}?\bnot\s+(available|offered|provided|support(ed)?)\b/i,

      // Citizenship / residency requirements
      /us citizen(ship)? (required|only)/i,
      /\b(us\s+citizen(ship)?|must\s+be\s+authorized\s+to\s+work|eligible\s+for\s+government\s+security\s+clearance|access\s+to\s+classified)\b/i,
      // Commenting for effecientcy
      // /green card (holder )?(required|only)/i,
      // /permanent resident (required|only)/i,
      /\bCitizenship Requirement\s*:\s*U\.?S\.?\s+Citizen\b/i,
      /\bU\.?S\.?\s+citizenship\b[\s\S]*?\brequired\b/i,
      /\b(u\.?\s*s\.?\s*(person|citizen(ship)?)|security\s+clearance|obtain\s+(a\s+)?security\s+clearance|get\s+(a\s+)?security\s+clearance)\b/i,
      

      // Work authorization restrictions
      /must (already )?be authorized to work/i,
      /authorized to work (permanently|in the us)/i,
      /only considering candidates who are authorized/i,
      /must have unrestricted work authorization/i,
      /no visa support/i,
    ],

    sponsor: [
      /(visa )?sponsorship (available|provided|offered)/i,
      /will sponsor/i,
      /we sponsor/i,
      /sponsorship available/i,
      /\b(visa\s+)?sponsor(ship|ed|ing)?\b[\s\S]{0,20}?\bnot\s+required\b/i,
    ],

    unknown: [
      /visa/i,
      /sponsorship/i,
      /work authorization/i,
    ],
  };

  // 1️⃣ Check NO SPONSOR (highest priority)
  for (const pattern of patterns.noSponsor) {
    const match = text.match(pattern);
    if (match) {
      return {
        status: "no_sponsor",
        sentence: match[0],
      };
    }
  }

  // 2️⃣ Check SPONSOR
  for (const pattern of patterns.sponsor) {
    const match = text.match(pattern);
    if (match) {
      return {
        status: "sponsor",
        sentence: match[0],
      };
    }
  }

  // 3️⃣ Weak mention → UNKNOWN
  for (const pattern of patterns.unknown) {
    const match = text.match(pattern);
    if (match) {
      return {
        status: "unknown",
        sentence: match[0],
      };
    }
  }

  return { status: "unknown", sentence: null };
}
