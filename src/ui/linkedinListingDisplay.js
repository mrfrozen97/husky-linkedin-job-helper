// ==========================================
// Get Active Job from List (New LinkedIn UI)
// ==========================================
function getActiveJobCard() {
  const jobList = document.querySelector('[data-testid="lazy-column"]');
  if (!jobList) return null;

  const wrappers = jobList.querySelectorAll("div._8ccc9747");

  // Iterate from bottom → top
  for (let i = wrappers.length - 1; i >= 0; i--) {
    const wrapper = wrappers[i];
    const styles = window.getComputedStyle(wrapper);
    const borderLeftColor = styles.borderLeftColor;

    if (
      borderLeftColor === "rgba(0, 0, 0, 0.9)" ||
      borderLeftColor === "rgb(0, 0, 0)"
    ) {
      return wrapper.querySelector("div[role='button']");
    }
  }

  return null;
}

// ==========================================
// Inject Summary Row Into Selected Job Card
// ==========================================
export function injectJobListSummary({ years, visaStatus, h1bStatus }) {
  // Try old layouts first
  let activeCard =
    document.querySelector('.job-card-container[aria-current="page"]') ||
    document.querySelector('.jobs-search-results-list__list-item--active');

  // 🔥 NEW LinkedIn layout fallback
  if (!activeCard) {
    activeCard = getActiveJobCard();
  }

  if (!activeCard) return;

  // Remove existing row
  activeCard.querySelector('.lia-summary-row')?.remove();

  const row = document.createElement("div");
  row.className = "lia-summary-row";

  Object.assign(row.style, {
    marginTop: "6px",
    padding: "6px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    background: "#f3f6f8"
  });

    const yearsBadge = createBadge(
        years ? `💼 ${years}y` : "💼 N/A",
        "#0a66c2"
    );

    const visaBadge = createBadge(
    visaStatus === "sponsor"
        ? "🟢 Sponsor"
        : visaStatus === "no_sponsor"
        ? "🔴 No Sponsor"
        : "🟡 Unknown",
    visaStatus === "sponsor"
        ? "#1e7e34"
        : visaStatus === "no_sponsor"
        ? "#b02a37"
        : "#856404"
    );

    const h1bBadge = createBadge(
    h1bStatus
        ? "🛂 H1B Sponsor"
        : "🛂 No H1B",
    h1bStatus
        ? "#1e7e34"   // same green as sponsor
        : "#b02a37"   // same red as no sponsor
    );

  row.appendChild(yearsBadge);
  row.appendChild(visaBadge);
  row.appendChild(h1bBadge);

  // Try multiple possible content containers
  const contentArea =
    activeCard.querySelector(".artdeco-entity-lockup__content") ||
    activeCard.querySelector("._72a29cf0") ||
    activeCard;

  contentArea.appendChild(row);
}

function createBadge(text, color) {
  const badge = document.createElement("span");
  badge.innerText = text;

  Object.assign(badge.style, {
    padding: "2px 6px",
    borderRadius: "12px",
    background: color + "15",
    color: color,
    fontSize: "11px"
  });

  return badge;
}