console.log("LinkedIn Job Assistant Loaded");

import extractYearsOfExperience from "../parser/yearParser";
import { extractVisaStatus } from "../parser/visaSponsorshipParser";
import {displayH1BStatus} from "../ui/h1bSponsorUI";

// ===============================
// Get Job Description Container
// ===============================
function getJobDescriptionContainer() {
  return (
    document.querySelector(".jobs-box__html-content") ||
    document.querySelector('[data-sdui-component*="aboutTheJob"]') ||
    document.querySelector('[data-test-id="job-details"]') ||
    document.querySelector(".job-view-layout")
  );
}

// ===============================
// Get Company Name
// ===============================
function getCompanyName() {
  // 1️⃣ Try old layout first
  let companyElement = document.querySelector(
    ".job-details-jobs-unified-top-card__company-name a"
  );

  // 2️⃣ Fallback: any LinkedIn company link
  if (!companyElement) {
    companyElement = document.querySelector('a[href*="/company/"]');
  }

  if (!companyElement) return null;

  return companyElement.innerText.trim();
}

// ===============================
// Inject Years UI
// ===============================
function injectIntoJobDetails(years) {
  const jobBox = getJobDescriptionContainer();
  if (!jobBox) return;

  let resultDiv = jobBox.querySelector(".exp-result-box");

  if (!resultDiv) {
    resultDiv = document.createElement("div");
    resultDiv.className = "exp-result-box";

    // Styling
    resultDiv.style.padding = "16px";
    resultDiv.style.marginBottom = "16px";
    resultDiv.style.background = "#e8f3ff";
    resultDiv.style.border = "1px solid #0a66c2";
    resultDiv.style.borderRadius = "10px";
    resultDiv.style.fontSize = "16px";
    resultDiv.style.lineHeight = "1.6";
    resultDiv.style.fontWeight = "600";
    resultDiv.style.color = "#0a66c2";
    resultDiv.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    resultDiv.style.fontFamily =
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    jobBox.prepend(resultDiv);
  }

  resultDiv.innerText = years
    ? `🧠 Years of Experience Required: ${years} years`
    : "🧠 Years of Experience: Not specified";
}



// ===============================
// Visa UI
// ===============================
function displayVisaStatus({ status, sentence }) {
  const jobBox = getJobDescriptionContainer();
  if (!jobBox) return;

  let resultDiv = jobBox.querySelector(".visa-result-box");

  if (!resultDiv) {
    resultDiv = document.createElement("div");
    resultDiv.className = "visa-result-box";

    // Base styling
    resultDiv.style.padding = "16px";
    resultDiv.style.marginBottom = "16px";
    resultDiv.style.borderRadius = "10px";
    resultDiv.style.fontSize = "16px";
    resultDiv.style.lineHeight = "1.6";
    resultDiv.style.fontWeight = "600";
    resultDiv.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
    resultDiv.style.fontFamily =
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    jobBox.prepend(resultDiv);
  }

  let background;
  let textColor;
  let label;

  if (status === "sponsor") {
    background = "#d4edda";
    textColor = "#155724";
    label = "🟢 Visa Sponsorship Available";
  } else if (status === "no_sponsor") {
    background = "#f8d7da";
    textColor = "#721c24";
    label = "🔴 No Visa Sponsorship";
  } else {
    background = "#fff3cd";
    textColor = "#856404";
    label = "🟡 Visa Sponsorship Unknown";
  }

  resultDiv.style.background = background;
  resultDiv.style.color = textColor;

  resultDiv.innerHTML = `
    ${label}
    <br/>
    <span style="font-size:14px; font-weight:500;">
      ${sentence ?? "No explicit statement found."}
    </span>
  `;
}

// ===============================
// Process Job
// ===============================
function processCurrentJob() {
  const jobBox = getJobDescriptionContainer();
  if (!jobBox) return;

  jobBox.querySelector(".exp-result-box")?.remove();
  jobBox.querySelector(".visa-result-box")?.remove();

  const descriptionText = jobBox.innerText;

  const years = extractYearsOfExperience(descriptionText);
  const result = extractVisaStatus(descriptionText);
  const companyName = getCompanyName();

  fetch(chrome.runtime.getURL("h1b_companies.json"))
    .then(res => res.json())
    .then(data => {
      displayH1BStatus(companyName, data);
    });

  injectIntoJobDetails(years);
  displayVisaStatus(result);
}

// ===============================
// SPA Safe Detection
// ===============================
let lastUrl = location.href;

function waitForNewJobAndProcess() {
  const interval = setInterval(() => {
    const jobBox = getJobDescriptionContainer();

    if (jobBox && jobBox.innerText.trim().length > 100) {
      clearInterval(interval);
      processCurrentJob();
    }
  }, 300);
}

setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    waitForNewJobAndProcess();
  }
}, 500);

// Initial run
waitForNewJobAndProcess();