#!/usr/bin/env node

/**
 * Fetch Sprint 1-16 data from Jira
 *
 * Usage:
 *   node fetch-jira-sprints.js
 *
 * Or with environment variables:
 *   JIRA_URL="https://xxx.atlassian.net" \
 *   JIRA_EMAIL="your@email.com" \
 *   JIRA_TOKEN="your-api-token" \
 *   JIRA_PROJECT="GAAM" \
 *   node fetch-jira-sprints.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const JIRA_URL = process.env.JIRA_URL || 'https://bounteous.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || 'am.puneeth@bounteous.com';
const JIRA_TOKEN = process.env.JIRA_TOKEN || '';
const PROJECT_KEY = process.env.JIRA_PROJECT || 'GAAM';

// Validate credentials
if (!JIRA_TOKEN) {
  console.error('❌ Missing JIRA_TOKEN environment variable');
  console.error('Please set it: set JIRA_TOKEN=your-api-token');
  process.exit(1);
}

const BASE_URL = JIRA_URL.replace(/\/$/, '');
const AUTH_HEADER = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║                     FETCHING JIRA SPRINT DATA                              ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

console.log(`📋 Configuration:`);
console.log(`   URL: ${BASE_URL}`);
console.log(`   Email: ${JIRA_EMAIL}`);
console.log(`   Project: ${PROJECT_KEY}\n`);

/**
 * Make HTTPS request to Jira API
 */
function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Basic ${AUTH_HEADER}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Fetch all sprints
 */
async function fetchSprints() {
  try {
    console.log('🔍 Fetching sprints...\n');

    // Fetch all sprints for the project
    const sprintsResponse = await makeRequest(`/rest/api/3/board?project=${PROJECT_KEY}`);

    if (sprintsResponse.status !== 200) {
      throw new Error(`Failed to fetch boards: ${sprintsResponse.status}`);
    }

    const boards = sprintsResponse.data.values || [];
    console.log(`Found ${boards.length} board(s)\n`);

    const allSprints = [];

    // Get sprints from each board
    for (const board of boards) {
      console.log(`📌 Board: ${board.name} (ID: ${board.id})`);

      try {
        const sprintResponse = await makeRequest(`/rest/api/3/board/${board.id}/sprint`);

        if (sprintResponse.status === 200) {
          const sprints = sprintResponse.data.values || [];
          allSprints.push(...sprints);
          console.log(`   Found ${sprints.length} sprint(s)\n`);
        }
      } catch (e) {
        console.error(`   ⚠️  Error fetching sprints: ${e.message}\n`);
      }
    }

    // Fetch detailed data for each sprint
    const sprintDetails = [];

    for (let i = 0; i < Math.min(allSprints.length, 20); i++) {
      const sprint = allSprints[i];
      console.log(`🔄 Sprint ${i+1}: ${sprint.name}`);

      try {
        // Fetch issues in sprint
        const issuesResponse = await makeRequest(
          `/rest/api/3/search?jql=sprint=${sprint.id}&maxResults=100&fields=key,summary,status,assignee,created,updated,customfield_10016`
        );

        if (issuesResponse.status === 200) {
          const issues = issuesResponse.data.issues || [];

          sprintDetails.push({
            sprintId: sprint.id,
            sprintName: sprint.name,
            state: sprint.state,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
            issueCount: issues.length,
            issues: issues.map(issue => ({
              key: issue.key,
              summary: issue.fields.summary,
              status: issue.fields.status?.name || 'Unknown',
              assignee: issue.fields.assignee?.displayName || 'Unassigned',
              storyPoints: issue.fields.customfield_10016 || 0,
              created: issue.fields.created,
              updated: issue.fields.updated
            }))
          });

          console.log(`   ✅ ${issues.length} issue(s)\n`);
        }
      } catch (e) {
        console.error(`   ⚠️  Error fetching issues: ${e.message}\n`);
      }
    }

    return sprintDetails;
  } catch (error) {
    console.error('❌ Error fetching sprints:', error.message);
    throw error;
  }
}

/**
 * Generate report
 */
function generateReport(sprints) {
  let report = '\n╔════════════════════════════════════════════════════════════════════════════╗\n';
  report += '║                      SPRINT DETAILED REPORT                                 ║\n';
  report += '╚════════════════════════════════════════════════════════════════════════════╝\n\n';

  let totalIssues = 0;
  let totalStoryPoints = 0;

  sprints.forEach((sprint, index) => {
    report += `📋 **SPRINT ${index + 1}: ${sprint.sprintName}**\n`;
    report += `   State: ${sprint.state}\n`;
    report += `   Start Date: ${sprint.startDate || 'N/A'}\n`;
    report += `   End Date: ${sprint.endDate || 'N/A'}\n`;
    report += `   Issues: ${sprint.issueCount}\n\n`;

    totalIssues += sprint.issueCount;

    if (sprint.issues.length > 0) {
      report += '   | Key | Summary | Status | Story Points |\n';
      report += '   |-----|---------|--------|---------------|\n';

      sprint.issues.forEach(issue => {
        totalStoryPoints += issue.storyPoints;
        report += `   | ${issue.key} | ${issue.summary.substring(0, 30)}... | ${issue.status} | ${issue.storyPoints} |\n`;
      });
    }

    report += '\n';
  });

  report += '╔════════════════════════════════════════════════════════════════════════════╗\n';
  report += `📊 TOTALS: ${sprints.length} sprints | ${totalIssues} issues | ${totalStoryPoints} story points\n`;
  report += '╚════════════════════════════════════════════════════════════════════════════╝\n';

  return report;
}

/**
 * Main execution
 */
async function main() {
  try {
    const sprints = await fetchSprints();

    if (sprints.length === 0) {
      console.log('⚠️  No sprints found');
      return;
    }

    const report = generateReport(sprints);
    console.log(report);

    // Save to file
    const reportPath = path.join(process.cwd(), 'JIRA_SPRINT_REPORT.md');
    fs.writeFileSync(reportPath, report);
    console.log(`\n✅ Report saved to: ${reportPath}\n`);

    // Save raw data
    const dataPath = path.join(process.cwd(), 'jira-sprints-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(sprints, null, 2));
    console.log(`✅ Raw data saved to: ${dataPath}\n`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
