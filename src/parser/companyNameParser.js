// Normalize company name (same logic you used in Python)
function normalizeCompany(name) {
  return name
    .toLowerCase()
    .replace(/[.,&\-]/g, " ")
    .replace(/\b(inc|llc|ltd|corp|corporation|company|co|pllc|pc|limited|services|service|group|holdings|technologies|technology)\b/g, "")
    .replace(/\bdba\b.*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract core name (first meaningful token)
function extractCoreName(name) {
  const tokens = normalizeCompany(name).split(" ");
  return tokens.length > 0 ? tokens[0] : "";
}

// Main function
export function findH1BSponsor(companyName, sponsorData) {
  const normalized = normalizeCompany(companyName);

  // 1️⃣ Exact match
  if (sponsorData[normalized]) {
    return normalized;
  }

  // 2️⃣ Substring match
  for (let key in sponsorData) {
    if (
      key.includes(normalized) ||
      normalized.includes(key)
    ) {
      return key;
    }
  }

  // 3️⃣ Core token match
  const core = extractCoreName(companyName);

  for (let key in sponsorData) {
    if (key.startsWith(core)) {
      return key;
    }
  }

  // ❌ No match found
  return null;
}