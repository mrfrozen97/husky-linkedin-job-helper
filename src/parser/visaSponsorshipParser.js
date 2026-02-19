export function extractVisaStatus(text) {
  if (!text) {
    return { status: "unknown", sentence: null };
  }

  const patterns = {
    noSponsor: [
      /no (visa )?sponsorship/i,
      /not sponsor/i,
      /unable to sponsor/i,
      /without sponsorship/i,
      /\b(no|without)\s+(visa\s+)?sponsor(ship|ed|ing)?\b|\b(visa\s+)?sponsor(ship|ed|ing)?\b[\s\S]{0,25}?\b(not\s+(available|offered|required)|not\s+sponsor(ing)?|not\s+provide(d)?|not\s+support(ed)?)\b|\bwe\s+do\s+not\s+sponsor\b/i,

      // Citizenship / residency requirements
      /us citizen(ship)? (required|only)/i,
      // Commenting for effecientcy
      // /green card (holder )?(required|only)/i,
      // /permanent resident (required|only)/i,
      /\bCitizenship Requirement\s*:\s*U\.?S\.?\s+Citizen\b/i,
      /\bU\.?S\.?\s+citizenship\b[\s\S]*?\brequired\b/i,

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
