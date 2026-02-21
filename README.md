# Husky 🐺

### A Chrome Extension to Simplify Your Job Search

Husky is a **Chrome Extension (Manifest V3)** that analyzes job descriptions directly on LinkedIn and classifies:

* 💼 **Years of Experience Required**
* 🟢 **Visa Sponsorship Available**
* 🔴 **No Sponsorship**
* 🟡 **Unknown Sponsorship**
* 🛂 **H1B Sponsorship Status**

It injects clean, color-coded UI badges directly into the job card interface to help you quickly filter opportunities.

---

# ✨ Features

* 💼 Extracts Years of Experience (YOE)
* 🟢🔴🟡 Detects visa sponsorship intent
* 🛂 Detects explicit H1B sponsorship availability
* ⚡ Lightweight and fast (no external APIs)

---

# 📦 Project Structure

```
simple-google-chrome-extension/
│
├── manifest.json
├── background.js
├── popup.html
├── popup.js
│
├── src/
│   └── parser/
│       ├── visaSponsorshipParser.js
│       └── yearParser.js
│
├── test_cases/
│   ├── sponsorship_test_cases/
│   │   ├── files/
│   │   └── runSponsorshipTests.js
│   │
│   └── years_test_cases/
│       ├── files/
│       └── runYearsOfExpTests.js
│
├── vite.config.js
├── package.json
└── README.md
```

---

# 🚀 Setup & Installation

## 1️⃣ Install Dependencies

From project root:

```bash
npm install
```

---

## 2️⃣ Build the Extension

```bash
npm run build
```

This uses **Vite** to bundle your content scripts into `/dist`.

---

# 🧩 Load Extension in Chrome

1. Open Chrome
2. Go to:

```
chrome://extensions
```

3. Enable **Developer Mode** (top-right toggle)
4. Click **Load Unpacked**
5. Select the project root folder

The extension will now be active.

---

# 🧠 How It Works

### 1. Years of Experience Parser

Uses pattern detection (regex-based) to extract:

* “3+ years”
* “Minimum 2 years”
* “5 years of experience required”
* etc.

Returns structured YOE value.

---

### 2. Visa Sponsorship Parser

Classifies job description into:

* `sponsor`
* `no_sponsor`
* `unknown`

Handles:

* Explicit sponsorship statements
* Negations
* Ambiguous wording

---

### 3. H1B Detection

Separately identifies mentions of:

* H1B sponsorship
* H1B transfers
* “Will not sponsor H1B”
* Cap-exempt statements

Displayed with red/green UI badge.

---

# 🧪 Running Tests (Test Driven Development)

This project includes a lightweight Node-based test runner.

## Run All Tests

```bash
npm test
```

---

# ➕ Adding More Test Cases

## Visa Sponsorship Tests

Go to:

```
test_cases/sponsorship_test_cases/files/
```

Add new `.txt` file:

### For No Sponsorship:

```
visa_req2.txt
```

### For Sponsorship Available:

```
visa_notreq2.txt
```

### For Unknown:

```
visa_unk2.txt
```

Then run:

```bash
node test_cases/sponsorship_test_cases/runSponsorshipTests.js
```

---

## Years of Experience Tests

Go to:

```
test_cases/years_test_cases/files/
```

Add `.txt` file with job description text.

Run:

```bash
node test_cases/years_test_cases/runYearsOfExpTests.js
```

# 📈 Future Improvements

* Scoring-based NLP instead of regex
* Negation direction detection improvements
* Confidence scoring
* Bulk job scanning
* CI integration
* Convert test runner to Jest
* Add optional LLM integrations for:

  * Resume tailoring
  * Cover letter generation
  * “Why do you want to work here?” answers

---

# 🛡 Disclaimer

This extension:

* Does not scrape accounts
* Does not store personal data
* Runs entirely client-side

---
