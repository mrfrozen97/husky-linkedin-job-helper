import fs from "fs";
import path from "path";
import extractYearsOfExperience from "../../src/parser/yearParser.js";

const TEST_DIR = path.resolve("./test_cases/years_test_cases/files");

function parseTestFile(content) {
  const lines = content.trim().split("\n");

  const lastLine = lines[lines.length - 1].trim();

  const expectedMatch = lastLine.match(/^Expected:\s*(.+)$/i);

  if (!expectedMatch) {
    throw new Error("Missing 'Expected:' line in test file");
  }

  const expectedRaw = expectedMatch[1].trim();

  const expected = expectedRaw.toLowerCase() === "null"
    ? null
    : expectedRaw;

  // Remove the Expected line from content
  const actualText = lines.slice(0, -1).join("\n").trim();

  return { actualText, expected };
}

function runTests() {
  const files = fs.readdirSync(TEST_DIR);

  let total = 0;
  let passed = 0;

  for (const file of files) {
    if (!file.endsWith(".txt")) continue;

    const filePath = path.join(TEST_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const { actualText, expected } = parseTestFile(content);

    const result = extractYearsOfExperience(actualText);
    console.log(result);

    total++;

    const success = result === expected;

    if (success) {
      passed++;
      console.log(`✅ PASS: ${file}`);
    } else {
      console.log(`❌ FAIL: ${file}`);
      console.log(`   Expected: ${expected}`);
      console.log(`   Got:      ${result}`);
      console.log("--------------------------------------------------");
    }
  }

  console.log("\n===============================");
  console.log(`Tests Passed: ${passed}/${total}`);
  console.log("===============================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();