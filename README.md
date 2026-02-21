
# Husky -  A Chrome Extension to Simplify Job Search

This is a Chrome Extension (Manifest V3) that analyzes job descriptions and classifies visa sponsorship status as:

* Years of Experience Required

* 🟢 Sponsor Available
* 🔴 No Sponsorship
* 🟡 Unknown


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
|       └── yearParser.js
│
├── test_cases/
│   └── sponsorship_test_cases/
│       ├── files
│       └── runSponsorshipTests.js
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

This uses Vite to bundle your content script into `/dist`.

---

# 🧩 Load Extension in Chrome

1. Open Chrome
2. Go to:

```
chrome://extensions
```

3. Enable **Developer Mode** (top right toggle)
4. Click **Load Unpacked**
5. Select the project root folder

After loading, the extension will appear in your extensions list.

---

# 🧪 Running Tests (Test Driven Development)

Your project includes a Node-based test runner for visa sponsorship classification.

## Run Tests

From project root:

```bash
npm test
```


# ➕ Adding More Test Cases

To add a new test:

1. Go to:

```
test_cases/sponsorship_test_cases/
```

2. Create a new `.txt` file using naming convention:

### For No Sponsorship:

```
visa_req2.txt
visa_req3.txt
```

### For Sponsorship Available:

```
visa_notreq2.txt
```

### For Unknown:

```
visa_unk2.txt
```

3. Add job description text inside the file.
4. Re-run:

```bash
node test_cases/sponsorship_test_cases/runSponsorshipTests.js
```

No test file modification required.

---



# 📈 Future Improvements

Possible next steps:

* Scoring-based NLP instead of pure regex
* Negation direction detection
* Confidence scoring
* UI badge indicator
* GitHub CI integration
* Convert to Jest for richer testing
* Adding LLM APIs to asnwer questions like "Why do you want to Work here?"

---