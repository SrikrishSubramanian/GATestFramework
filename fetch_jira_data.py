#!/usr/bin/env python3
"""
Fetch Sprint 1-16 detailed data from Jira
"""

import requests
import json
import sys
from requests.auth import HTTPBasicAuth
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration
JIRA_URL = "https://bounteous.atlassian.net"
JIRA_EMAIL = "am.puneeth@bounteous.com"
JIRA_TOKEN = os.environ.get('JIRA_API_TOKEN', '')
if not JIRA_TOKEN:
    print('❌ Error: JIRA_API_TOKEN environment variable not set')
    sys.exit(1)
PROJECT_KEY = "GAAM"

print("\n" + "="*80)
print("                     FETCHING JIRA SPRINT DATA")
print("="*80 + "\n")

print(f"📋 Configuration:")
print(f"   URL: {JIRA_URL}")
print(f"   Email: {JIRA_EMAIL}")
print(f"   Project: {PROJECT_KEY}\n")

auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_TOKEN)
headers = {"Accept": "application/json"}

try:
    # Step 1: Get boards
    print("🔍 Step 1: Fetching boards...")
    boards_url = f"{JIRA_URL}/rest/api/3/board?project={PROJECT_KEY}"
    boards_response = requests.get(boards_url, auth=auth, headers=headers, verify=False)

    if boards_response.status_code != 200:
        print(f"❌ Failed to fetch boards: {boards_response.status_code}")
        print(f"Response: {boards_response.text}")
        sys.exit(1)

    boards = boards_response.json().get('values', [])
    print(f"✅ Found {len(boards)} board(s)\n")

    if not boards:
        print("❌ No boards found for this project")
        sys.exit(1)

    all_sprints = []

    # Step 2: Get sprints for each board
    for board in boards:
        print(f"📌 Board: {board['name']} (ID: {board['id']})")

        sprints_url = f"{JIRA_URL}/rest/api/3/board/{board['id']}/sprint"
        sprints_response = requests.get(sprints_url, auth=auth, headers=headers, verify=False)

        if sprints_response.status_code == 200:
            sprints = sprints_response.json().get('values', [])
            all_sprints.extend(sprints)
            print(f"   ✅ Found {len(sprints)} sprint(s)\n")
        else:
            print(f"   ⚠️  Error fetching sprints: {sprints_response.status_code}\n")

    # Step 3: Get detailed data for each sprint
    print("🔄 Fetching sprint details...\n")

    sprint_details = []

    for i, sprint in enumerate(all_sprints[:20], 1):  # Get first 20 sprints
        print(f"[{i}/{min(len(all_sprints), 20)}] Sprint: {sprint['name']}")

        # Get issues in this sprint
        search_url = f"{JIRA_URL}/rest/api/3/search"
        search_params = {
            'jql': f'sprint={sprint["id"]}',
            'maxResults': 100,
            'fields': 'key,summary,status,assignee,created,updated,customfield_10016'
        }

        issues_response = requests.get(search_url, params=search_params,
                                      auth=auth, headers=headers, verify=False)

        if issues_response.status_code == 200:
            issues = issues_response.json().get('issues', [])

            sprint_info = {
                'sprintId': sprint['id'],
                'sprintName': sprint['name'],
                'state': sprint['state'],
                'startDate': sprint.get('startDate', 'N/A'),
                'endDate': sprint.get('endDate', 'N/A'),
                'issueCount': len(issues),
                'issues': []
            }

            for issue in issues:
                sprint_info['issues'].append({
                    'key': issue['key'],
                    'summary': issue['fields'].get('summary', ''),
                    'status': issue['fields'].get('status', {}).get('name', 'Unknown'),
                    'assignee': issue['fields'].get('assignee', {}).get('displayName', 'Unassigned'),
                    'storyPoints': issue['fields'].get('customfield_10016', 0),
                    'created': issue['fields'].get('created', ''),
                    'updated': issue['fields'].get('updated', '')
                })

            sprint_details.append(sprint_info)
            print(f"   ✅ {len(issues)} issue(s)\n")
        else:
            print(f"   ⚠️  Error fetching issues: {issues_response.status_code}\n")

    # Generate report
    print("\n" + "="*80)
    print("                      SPRINT DETAILED REPORT")
    print("="*80 + "\n")

    total_issues = 0
    total_story_points = 0

    for idx, sprint in enumerate(sprint_details, 1):
        print(f"📋 **SPRINT {idx}: {sprint['sprintName']}**")
        print(f"   State: {sprint['state']}")
        print(f"   Start Date: {sprint['startDate']}")
        print(f"   End Date: {sprint['endDate']}")
        print(f"   Issues: {sprint['issueCount']}\n")

        total_issues += sprint['issueCount']

        if sprint['issues']:
            print(f"   | Key | Summary | Status | Assigned To | Story Points |")
            print(f"   |-----|---------|--------|-------------|--------------|")

            for issue in sprint['issues']:
                total_story_points += (issue['storyPoints'] or 0)
                summary = issue['summary'][:30] + "..." if len(issue['summary']) > 30 else issue['summary']
                print(f"   | {issue['key']} | {summary} | {issue['status']} | {issue['assignee']} | {issue['storyPoints']} |")

        print()

    print("="*80)
    print(f"📊 TOTALS: {len(sprint_details)} sprints | {total_issues} issues | {total_story_points} story points")
    print("="*80 + "\n")

    # Save to files
    report_path = "JIRA_SPRINT_REPORT.json"
    with open(report_path, 'w') as f:
        json.dump(sprint_details, f, indent=2)

    print(f"✅ Raw data saved to: {report_path}\n")

    # Also save as markdown
    md_path = "JIRA_SPRINT_REPORT.md"
    with open(md_path, 'w') as f:
        f.write("# Jira Sprint Report\n\n")
        f.write(f"**Project:** {PROJECT_KEY}\n\n")

        for idx, sprint in enumerate(sprint_details, 1):
            f.write(f"## Sprint {idx}: {sprint['sprintName']}\n\n")
            f.write(f"- **State:** {sprint['state']}\n")
            f.write(f"- **Start Date:** {sprint['startDate']}\n")
            f.write(f"- **End Date:** {sprint['endDate']}\n")
            f.write(f"- **Issues:** {sprint['issueCount']}\n\n")

            if sprint['issues']:
                f.write("| Key | Summary | Status | Assigned To | Story Points |\n")
                f.write("|-----|---------|--------|-------------|---------------|\n")

                for issue in sprint['issues']:
                    f.write(f"| {issue['key']} | {issue['summary']} | {issue['status']} | {issue['assignee']} | {issue['storyPoints']} |\n")

            f.write("\n")

    print(f"✅ Markdown report saved to: {md_path}\n")

except requests.exceptions.RequestException as e:
    print(f"❌ Request error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)

print("✅ Done!\n")
