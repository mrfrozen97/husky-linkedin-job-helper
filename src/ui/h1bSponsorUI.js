function getJobDescriptionContainer() {
  return (
    document.querySelector(".jobs-box__html-content") ||
    document.querySelector('[data-sdui-component*="aboutTheJob"]') ||
    document.querySelector('[data-test-id="job-details"]') ||
    document.querySelector(".job-view-layout")
  );
}

// ===============================
// H1B Sponsor UI
// ===============================
export function displayH1BStatus({ isSponsor }) {
  const jobBox = getJobDescriptionContainer();
  if (!jobBox) return;

  // Remove old box if exists
  jobBox.querySelector(".h1b-result-box")?.remove();

  const resultDiv = document.createElement("div");
  resultDiv.className = "h1b-result-box";

  Object.assign(resultDiv.style, {
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "10px",
    fontSize: "16px",
    lineHeight: "1.6",
    fontWeight: "600",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  });

  if (isSponsor) {
    resultDiv.style.background = "#d4edda";
    resultDiv.style.color = "#155724";
    resultDiv.innerText =
      "🟢 H1B Sponsor Detected (Past Filings Found)";
  } else {
    resultDiv.style.background = "#f8d7da";
    resultDiv.style.color = "#721c24";
    resultDiv.innerText =
      "🔴 No H1B Sponsorship Record Found";
  }

  jobBox.prepend(resultDiv);
}