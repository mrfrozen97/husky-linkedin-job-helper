
console.log("LinkedIn Job Assistant Loaded");
import extractYearsOfExperience from "./src/parser/yearParser";

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

  // 🔥 Remove previous injected box BEFORE extracting
  const oldBox = jobBox.querySelector(".exp-result-box");
  if (oldBox) oldBox.remove();

  const descriptionText = jobBox.innerText;
  const years = extractYearsOfExperience(descriptionText);

  console.log("Extracted years:", years);

  injectIntoJobDetails(years);
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

setInterval(() => {
  if (location.href !== lastUrl) {
    console.log("URL changed:", location.href);
    lastUrl = location.href;

    waitForNewJobAndProcess();
  }
}, 500);

// Initial run
waitForNewJobAndProcess();
