#!/usr/bin/env node

/**
 * Verify Jira API Token
 *
 * Usage:
 *   JIRA_API_TOKEN=your-token node scripts/verify-jira-token.js
 */

const https = require('https');

const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || '';
const JIRA_USERNAME = process.env.JIRA_USERNAME || 'am.puneeth@bounteous.com';
const JIRA_URL = process.env.JIRA_URL || 'https://bounteous.jira.com';

console.log('\n╔════════════════════════════════════════════════════════════════════╗');
console.log('║              Jira API Token Verification                           ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

if (!JIRA_API_TOKEN) {
    console.error('❌ ERROR: JIRA_API_TOKEN not set\n');
    console.log('Set it before running:');
    console.log('  export JIRA_API_TOKEN="your-api-token-here"');
    console.log('  node scripts/verify-jira-token.js\n');
    process.exit(1);
}

console.log('📋 Configuration:');
console.log(`   Jira URL: ${JIRA_URL}`);
console.log(`   Email: ${JIRA_USERNAME}`);
console.log(`   Token: ${JIRA_API_TOKEN.substring(0, 10)}...${JIRA_API_TOKEN.substring(JIRA_API_TOKEN.length - 5)}\n`);

console.log('🔍 Testing Jira connection...\n');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');
        const url = new URL(JIRA_URL + path);

        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        let responseData = '';

        const req = https.request(options, (res) => {
            res.on('data', (chunk) => (responseData += chunk));
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    data: responseData ? JSON.parse(responseData) : null
                });
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function verify() {
    try {
        // Test 1: Get current user
        console.log('Test 1: Fetching current user...');
        const userResponse = await makeRequest('/rest/api/3/myself');

        if (userResponse.status === 200) {
            const user = userResponse.data;
            console.log(`✅ SUCCESS: Authenticated as ${user.displayName}`);
            console.log(`   Account: ${user.emailAddress}\n`);
        } else {
            console.error(`❌ FAILED: HTTP ${userResponse.status}`);
            console.error(`   Response: ${JSON.stringify(userResponse.data)}\n`);
            process.exit(1);
        }

        // Test 2: Get a sample ticket
        console.log('Test 2: Fetching sample ticket (GAAM-1267)...');
        const ticketResponse = await makeRequest('/rest/api/3/issue/GAAM-1267');

        if (ticketResponse.status === 200) {
            const ticket = ticketResponse.data;
            console.log(`✅ SUCCESS: Found ticket GAAM-1267`);
            console.log(`   Title: ${ticket.fields.summary}`);
            console.log(`   Status: ${ticket.fields.status.name}\n`);
        } else {
            console.error(`❌ FAILED: HTTP ${ticketResponse.status}`);
            console.error(`   This might mean you don't have access to that project\n`);
            process.exit(1);
        }

        // Summary
        console.log('╔════════════════════════════════════════════════════════════════════╗');
        console.log('║                         ✅ ALL TESTS PASSED                         ║');
        console.log('╚════════════════════════════════════════════════════════════════════╝\n');

        console.log('Your Jira token is valid! You can now run batch generation:\n');
        console.log('   node scripts/run-sprint-18-batch.js local 3\n');

        process.exit(0);

    } catch (err) {
        console.error(`\n❌ ERROR: ${err.message}\n`);

        if (err.code === 'ENOTFOUND') {
            console.error('Network Error: Cannot reach Jira. Check:');
            console.error('  - Your internet connection');
            console.error('  - Jira URL is correct');
            console.error('  - You\'re not behind a proxy that requires authentication\n');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Connection Refused: Cannot connect to Jira. Check:');
            console.error('  - Jira is accessible');
            console.error('  - The URL is correct\n');
        }

        process.exit(1);
    }
}

verify();
