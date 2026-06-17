#!/usr/bin/env python3
"""
Batch fetch Jira tickets for test generation
"""

import requests
import json
import sys
from requests.auth import HTTPBasicAuth
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

JIRA_URL = "https://bounteous.jira.com"
JIRA_EMAIL = "am.puneeth@bounteous.com"
JIRA_TOKEN = os.environ.get('JIRA_API_TOKEN', '')
if not JIRA_TOKEN:
    print('❌ Error: JIRA_API_TOKEN environment variable not set')
    sys.exit(1)
PROJECT_KEY = "GAAM"

TICKETS = [
    'GAAM-1267', 'GAAM-1265', 'GAAM-1252', 'GAAM-1245', 'GAAM-1244', 'GAAM-1217',
    'GAAM-1192', 'GAAM-1179', 'GAAM-1174', 'GAAM-1172', 'GAAM-1155', 'GAAM-1145',
    'GAAM-1138', 'GAAM-1101', 'GAAM-1089', 'GAAM-1084', 'GAAM-1082', 'GAAM-1073',
    'GAAM-1063', 'GAAM-1062', 'GAAM-1021', 'GAAM-989', 'GAAM-978', 'GAAM-903',
    'GAAM-747', 'GAAM-450', 'GAAM-278', 'GAAM-170'
]

print("\n" + "="*80)
print("              BATCH JIRA TICKET FETCH FOR TEST GENERATION")
print("="*80 + "\n")

print(f"📋 Fetching {len(TICKETS)} tickets...\n")

auth = HTTPBasicAuth(JIRA_EMAIL, JIRA_TOKEN)
headers = {"Accept": "application/json"}

tickets_data = []
failed_tickets = []

# Fetch each ticket
for i, ticket_key in enumerate(TICKETS, 1):
    sys.stdout.write(f'[{i}/{len(TICKETS)}] {ticket_key}... ')
    sys.stdout.flush()

    try:
        url = f"{JIRA_URL}/rest/api/3/issues/{ticket_key}"
        response = requests.get(url, auth=auth, headers=headers, verify=False, timeout=10)

        if response.status_code == 200:
            ticket = response.json()

            # Extract relevant data
            ticket_info = {
                'key': ticket_key,
                'summary': ticket['fields'].get('summary', ''),
                'status': ticket['fields'].get('status', {}).get('name', 'Unknown'),
                'assignee': ticket['fields'].get('assignee', {}).get('displayName', 'Unassigned'),
                'description': ticket['fields'].get('description', {}).get('content', []) if ticket['fields'].get('description') else [],
                'components': [c.get('name', '') for c in ticket['fields'].get('components', [])],
                'labels': ticket['fields'].get('labels', []),
                'created': ticket['fields'].get('created', ''),
                'updated': ticket['fields'].get('updated', ''),
                'raw': ticket
            }

            tickets_data.append(ticket_info)
            print("✅")
        else:
            print(f"❌ HTTP {response.status_code}")
            failed_tickets.append({'key': ticket_key, 'status': response.status_code})

    except requests.exceptions.RequestException as e:
        print(f"❌ {str(e)[:30]}...")
        failed_tickets.append({'key': ticket_key, 'error': str(e)})

print(f"\n✅ Successfully fetched {len(tickets_data)} tickets")
if failed_tickets:
    print(f"⚠️  Failed to fetch {len(failed_tickets)} tickets:")
    for f in failed_tickets[:5]:
        print(f"   - {f['key']}: {f.get('status') or f.get('error')}")

# Group by component
components = {}
for ticket in tickets_data:
    # Use first component or extract from summary
    component = ticket['components'][0] if ticket['components'] else ticket['summary'].split(':')[0].strip().lower()

    if component not in components:
        components[component] = []
    components[component].append(ticket)

print(f"\n📦 Grouped by component:")
for comp in sorted(components.keys()):
    print(f"   {comp}: {len(components[comp])} ticket(s)")

# Save to artifacts
import os
artifacts_dir = ".aem-developer/artifacts"
os.makedirs(artifacts_dir, exist_ok=True)

output = {
    'timestamp': str(__import__('datetime').datetime.now().isoformat()),
    'totalTickets': len(tickets_data),
    'totalComponents': len(components),
    'components': {comp: [t['key'] for t in tickets] for comp, tickets in components.items()},
    'tickets': tickets_data,
    'failed': failed_tickets
}

output_path = os.path.join(artifacts_dir, 'batch-jira-requirements.json')
with open(output_path, 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n✅ Saved requirements to: {output_path}")

# Extract components list
component_list = list(components.keys())
component_list_path = os.path.join(artifacts_dir, 'batch-components.json')
with open(component_list_path, 'w') as f:
    json.dump(component_list, f, indent=2)

print(f"✅ Component list saved to: {component_list_path}")
print(f"\n🎯 Next step: Run test generation for each component using Playwright orchestrator\n")
