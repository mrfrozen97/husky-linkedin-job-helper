import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const TEST_ROOT = path.resolve("./test_cases");

async function runAllTests(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // If directory → recurse
    if (entry.isDirectory()) {
      await runAllTests(fullPath);
    }

    // If JS test file → run it
    else if (entry.isFile() && entry.name.endsWith(".js")) {
      console.log(`\n🚀 Running: ${fullPath}`);
      await import(pathToFileURL(fullPath));
    }
  }
}

runAllTests(TEST_ROOT)
  .then(() => {
    console.log("\n✅ All tests completed");
  })
  .catch(err => {
    console.error("❌ Test execution failed");
    console.error(err);
    process.exit(1);
  });