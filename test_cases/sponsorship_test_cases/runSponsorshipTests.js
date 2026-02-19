import fs from "fs";
import path from "path";
import { extractVisaStatus } from "../../src/parser/visaSponsorshipParser.js"; 

const TEST_DIR = path.resolve("./test_cases/sponsorship_test_cases/files");

function getExpectedStatus(filename) {
  if (filename.startsWith("visa_req")) return "no_sponsor";
  if (filename.startsWith("visa_notreq")) return "sponsor";
  if (filename.startsWith("visa_unk")) return "unknown";
  return null;
}

function runTests() {
  const files = fs.readdirSync(TEST_DIR);

  let total = 0;
  let passed = 0;

  for (const file of files) {
    if (!file.endsWith(".txt")) continue;

    const expected = getExpectedStatus(file);
    if (!expected) continue;

    const filePath = path.join(TEST_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const result = extractVisaStatus(content);

    total++;

    const success = result.status === expected;

    if (success) {
      passed++;
      console.log(`✅ PASS: ${file}`);
    } else {
      console.log(`❌ FAIL: ${file}`);
      console.log(`   Expected: ${expected}`);
      console.log(`   Got:      ${result.status}`);
      console.log(`   Matched:  ${result.sentence}`);
      console.log("--------------------------------------------------");
    }
  }

  console.log("\n===============================");
  console.log(`Tests Passed: ${passed}/${total}`);
  console.log("===============================\n");

  if (passed !== total) {
    process.exit(1); // fail build
  }
}

runTests();
