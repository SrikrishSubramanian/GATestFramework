// send-report.js
const fs = require("fs");
const path = require("path");
const https = require("https");

// ---------------- CONFIG ----------------
const reportDir = path.join(process.cwd(), "playwright-report");

// playwright.config.ts writes the JSON reporter to a timestamped subfolder
// (playwright-report/<date>/run-<timestamp>/results.json), so find the most
// recently written results.json instead of assuming a flat path.
function findLatestResultsJson(dir) {
  let latest = null;
  let latestMtime = 0;

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === "results.json") {
        const mtime = fs.statSync(fullPath).mtimeMs;
        if (mtime > latestMtime) {
          latestMtime = mtime;
          latest = fullPath;
        }
      }
    }
  }

  if (fs.existsSync(dir)) {
    walk(dir);
  }
  return latest;
}

const resultsJsonPath = findLatestResultsJson(reportDir);

const webhookUrl = process.env.WEBHOOK_URL;
const buildUrl = `https://bitbucket.org/${process.env.BITBUCKET_WORKSPACE}/${process.env.BITBUCKET_REPO_SLUG}/addon/pipelines/home#!/results/${process.env.BITBUCKET_BUILD_NUMBER}`;
const exitCode = Number(process.env.BITBUCKET_EXIT_CODE || 0);

// Read project name from env (set in pipeline)
const projectName = process.env.BITBUCKET_PROJECT_NAME || "Desktop";

// ---------------- PARSE PLAYWRIGHT JSON ----------------
function parseSummary(report) {
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let flaky = 0;

  function walkSuite(suite) {
    suite.specs?.forEach(spec => {
      spec.tests?.forEach(test => {
        const results = test.results || [];

        if (results.length > 1) {
          flaky++;
        }

        const lastResult = results[results.length - 1];

        if (!lastResult) return;

        switch (lastResult.status) {
          case "passed":
            passed++;
            break;
          case "failed":
          case "timedOut":
            failed++;
            break;
          case "skipped":
          case "interrupted":
            skipped++;
            break;
        }
      });
    });

    suite.suites?.forEach(walkSuite);
  }

  report.suites.forEach(walkSuite);

  return { passed, failed, skipped, flaky };
}

// ---------------- MAIN ----------------
async function sendReport() {
  try {
    if (!resultsJsonPath) {
      throw new Error("Playwright results.json not found");
    }

    const report = JSON.parse(fs.readFileSync(resultsJsonPath, "utf-8"));
    const { passed, failed, skipped, flaky } = parseSummary(report);

    const total = passed + failed + skipped + flaky;
    const buildFailed = exitCode !== 0 || failed > 0;

    // Decide title based on project
    const isMobile = projectName.toLowerCase().includes("mobile");
    const reportTitle = isMobile
      ? "📱 Playwright Mobile Automation Report"
      : "💻 Playwright Desktop Automation Report";

    // Flat fields so the Power Automate flow's trigger schema can map each
    // one individually (e.g. Total/Passed/Failed/Build link) into its card.
    const payload = {
      project: projectName,
      title: buildFailed ? `❌ ${reportTitle}` : `✅ ${reportTitle}`,
      status: buildFailed ? "Failed" : "Passed",
      total: total,
      passed: passed,
      failed: failed,
      skipped: skipped,
      flaky: flaky,
      buildUrl: buildUrl
    };

    await postToTeams(webhookUrl, payload);
    console.log("✅ Teams notification sent");

  } catch (err) {
    console.error("❌ Failed to send Teams notification:", err.message);
  }
}

// ---------------- HTTPS POST ----------------
function postToTeams(webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const req = https.request(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
      }
    }, res => {
      res.on("data", () => {});
      res.on("end", resolve);
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

sendReport();
