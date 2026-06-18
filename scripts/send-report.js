// send-report.js
const fs = require("fs");
const path = require("path");
const https = require("https");

// ---------------- CONFIG ----------------
const reportDir = path.join(process.cwd(), "playwright-report");
const resultsJsonPath = path.join(reportDir, "results.json");

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
    if (!fs.existsSync(resultsJsonPath)) {
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

    const payload = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      summary: "Playwright Test Results",
      themeColor: buildFailed ? "FF0000" : "00FF00",
      title: buildFailed
        ? `❌ ${reportTitle}`
        : `✅ ${reportTitle}`,
      sections: [
        {
          facts: [
            { name: "Project", value: projectName },
            { name: "Total", value: `${total}` },
            { name: "Passed", value: `${passed}` },
            { name: "Failed", value: `${failed}` },
            { name: "Skipped", value: `${skipped}` },
            { name: "Flaky", value: `${flaky}` }
          ]
        },
        {
          text: `[View Bitbucket Build](${buildUrl})`
        }
      ]
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
