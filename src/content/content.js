console.log("LinkedIn Job Assistant Loaded");

import extractYearsOfExperience from "../parser/yearParser";
import { extractVisaStatus } from "../parser/visaSponsorshipParser";
import { injectJobListSummary } from "../ui/linkedinListingDisplay";
import { findH1BSponsor } from "../parser/companyNameParser";
import {displayH1BStatus} from "../ui/h1bSponsorUI";

// ===============================
// Global Sponsor Cache (LOAD ONCE)
// ===============================
let sponsorData = null;
let sponsorDataPromise = null;

function loadSponsorData() {
  if (!sponsorDataPromise) {
    sponsorDataPromise = fetch(
      chrome.runtime.getURL("h1b_companies.json")
    )
      .then(res => res.json())
      .then(data => {
        sponsorData = data;
        console.log("H1B sponsor data loaded");
        return data;
      })
      .catch(err => {
        console.error("Failed to load H1B data:", err);
      });
  }
  return sponsorDataPromise;
}

// Preload immediately
loadSponsorData();

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
  let companyElement = document.querySelector(
    ".job-details-jobs-unified-top-card__company-name a"
  );

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

    Object.assign(resultDiv.style, {
      padding: "16px",
      marginBottom: "16px",
      background: "#e8f3ff",
      border: "1px solid #0a66c2",
      borderRadius: "10px",
      fontSize: "16px",
      lineHeight: "1.6",
      fontWeight: "600",
      color: "#0a66c2",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    });

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

  Object.assign(resultDiv.style, {
    background,
    color: textColor
  });

  resultDiv.innerHTML = `
    ${label}
    <br/>
    <span style="font-size:14px; font-weight:500;">
      ${sentence ?? "No explicit statement found."}
    </span>
  `;
}

// ===============================
// Process Job (OPTIMIZED)
// ===============================
async function processCurrentJob() {
  const jobBox = getJobDescriptionContainer();
  if (!jobBox) return;

  jobBox.querySelector(".exp-result-box")?.remove();
  jobBox.querySelector(".visa-result-box")?.remove();

  const descriptionText = jobBox.innerText;

  const years = extractYearsOfExperience(descriptionText);
  const visaResult = extractVisaStatus(descriptionText);
  const companyName = getCompanyName();

  // Ensure sponsor data is ready
  await loadSponsorData();

  const matched =
    sponsorData && companyName
      ? findH1BSponsor(companyName, sponsorData)
      : null;

  injectJobListSummary({
    years,
    visaStatus: visaResult.status,
    h1bStatus: !!matched
  });

  injectIntoJobDetails(years);
  displayVisaStatus(visaResult);
  displayH1BStatus(matched);
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