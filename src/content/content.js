
console.log("LinkedIn Job Assistant Loaded");
import extractYearsOfExperience from "../parser/yearParser";
import { extractVisaStatus } from "../parser/visaSponsorshipParser";

// ===============================
// Inject / Update UI
// ===============================
function injectIntoJobDetails(years) {
  const jobBox = document.querySelector(".jobs-box__html-content");
  if (!jobBox) return;

  let resultDiv = jobBox.querySelector(".exp-result-box");

  if (!resultDiv) {
    resultDiv = document.createElement("div");
    resultDiv.className = "exp-result-box";
    resultDiv.style.padding = "12px";
    resultDiv.style.marginBottom = "12px";
    resultDiv.style.background = "#e8f3ff";
    resultDiv.style.border = "1px solid #0a66c2";
    resultDiv.style.borderRadius = "6px";
    resultDiv.style.fontWeight = "600";

    jobBox.prepend(resultDiv);
  }

  resultDiv.innerText = years
    ? `🧠 Years of Experience Required: ${years}+ years`
    : "🧠 Years of Experience: Not specified";
}

// ===============================
// Process Job
// ===============================
function processCurrentJob() {
  const jobBox = document.querySelector(".jobs-box__html-content");
  if (!jobBox) return;

  // 🔥 Remove ALL previously injected UI
  jobBox.querySelector(".exp-result-box")?.remove();
  jobBox.querySelector(".visa-result-box")?.remove();

  // Now extract clean text
  const descriptionText = jobBox.innerText;

  const years = extractYearsOfExperience(descriptionText);
  const result = extractVisaStatus(descriptionText);

  injectIntoJobDetails(years);
  displayVisaStatus(result);
}



// ===============================
// Watch URL change (SPA safe)
// ===============================
let lastUrl = location.href;

function waitForNewJobAndProcess() {
  const interval = setInterval(() => {
    const jobBox = document.querySelector(".jobs-box__html-content");

    if (jobBox && jobBox.innerText.trim().length > 100) {
      clearInterval(interval);
      processCurrentJob();
    }
  }, 300);
}


function displayVisaStatus({ status, sentence }) {
  const jobBox = document.querySelector(".jobs-box__html-content");
  if (!jobBox) return;

  let resultDiv = jobBox.querySelector(".visa-result-box");

  if (!resultDiv) {
    resultDiv = document.createElement("div");
    resultDiv.className = "visa-result-box";
    resultDiv.style.padding = "12px";
    resultDiv.style.marginBottom = "12px";
    resultDiv.style.borderRadius = "6px";
    resultDiv.style.fontWeight = "600";

    jobBox.prepend(resultDiv);
  }

  let color;
  let label;

  if (status === "sponsor") {
    color = "#d4edda";
    label = "🟢 Visa Sponsorship Available";
  } else if (status === "no_sponsor") {
    color = "#f8d7da";
    label = "🔴 No Visa Sponsorship";
  } else {
    color = "#fff3cd";
    label = "🟡 Visa Sponsorship Unknown";
  }

  resultDiv.style.background = color;
  console.log(sentence);
  resultDiv.innerHTML = `
    ${label}
    <br/>
    <small>${sentence ?? "No explicit statement found."}</small>
  `;
}


setInterval(() => {
  if (location.href !== lastUrl) {
    console.log("URL changed:", location.href);
    lastUrl = location.href;

    waitForNewJobAndProcess();
  }
}, 500);

// Initial run
waitForNewJobAndProcess();
