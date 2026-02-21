import {findH1BSponsor} from "../parser/companyNameParser";

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
export function displayH1BStatus(companyName, sponsorData) {
  const jobBox = getJobDescriptionContainer();
  if (!jobBox || !companyName) return;

  jobBox.querySelector(".h1b-result-box")?.remove();

  const matched = findH1BSponsor(companyName, sponsorData);

  const resultDiv = document.createElement("div");
  resultDiv.className = "h1b-result-box";

  resultDiv.style.padding = "16px";
  resultDiv.style.marginBottom = "16px";
  resultDiv.style.borderRadius = "10px";
  resultDiv.style.fontSize = "16px";
  resultDiv.style.lineHeight = "1.6";
  resultDiv.style.fontWeight = "600";
  resultDiv.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
  resultDiv.style.fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  if (matched) {
    resultDiv.style.background = "#d4edda";
    resultDiv.style.color = "#155724";
    resultDiv.innerText = `🟢 H1B Sponsor Detected (Past Filings Found)`;
  } else {
    resultDiv.style.background = "#f8d7da";
    resultDiv.style.color = "#721c24";
    resultDiv.innerText = `🔴 No H1B Sponsorship Record Found`;
  }

  jobBox.prepend(resultDiv);
}

