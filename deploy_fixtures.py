#!/usr/bin/env python3
"""
AEM Content Fixture Deployment Script
Automatically deploys 14 content fixture XML files to AEM via REST API
"""

import os
import sys
import json
import requests
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urljoin
import time

# Configuration
AEM_URL = "http://localhost:4502"
AEM_USER = "admin"
AEM_PASS = "admin"
FIXTURES_DIR = "tests/specFiles/ga"
BASE_PATH = "/content/global-atlantic/style-guide"

# Color output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

class AEMDeployer:
    def __init__(self, url, user, password):
        self.url = url
        self.user = user
        self.password = password
        self.session = requests.Session()
        self.session.auth = (user, password)
        self.session.headers.update({
            'User-Agent': 'AEM-Fixture-Deployer/1.0'
        })

    def test_connection(self):
        """Test connection to AEM"""
        try:
            response = self.session.get(
                f"{self.url}/crx/packmgr/service.jsp",
                timeout=5
            )
            if response.status_code == 200:
                print(f"{GREEN}✓ Connected to AEM at {self.url}{RESET}")
                return True
            else:
                print(f"{RED}✗ AEM returned status {response.status_code}{RESET}")
                return False
        except Exception as e:
            print(f"{RED}✗ Could not connect to AEM: {e}{RESET}")
            return False

    def create_path(self, path):
        """Create a JCR path if it doesn't exist"""
        try:
            # Check if path exists
            check_url = f"{self.url}{path}.json"
            response = self.session.get(check_url, timeout=5)

            if response.status_code == 200:
                print(f"{BLUE}  → Path exists: {path}{RESET}")
                return True

            # Create missing path
            print(f"{YELLOW}  → Creating path: {path}{RESET}")

            # Build path hierarchy
            parts = path.split('/')
            for i in range(2, len(parts) + 1):
                current_path = '/'.join(parts[:i])
                parent_path = '/'.join(parts[:i-1])
                node_name = parts[i-1]

                # Try to create node
                create_url = f"{self.url}{parent_path}.html"
                data = {
                    ':name': node_name,
                    'jcr:primaryType': 'sling:Folder'
                }

                response = self.session.post(create_url, data=data, timeout=5)

                if response.status_code in [200, 201]:
                    print(f"{GREEN}    ✓ Created: {current_path}{RESET}")
                elif response.status_code == 409:
                    print(f"{BLUE}    ✓ Already exists: {current_path}{RESET}")
                else:
                    print(f"{YELLOW}    ~ Status {response.status_code} for {current_path}{RESET}")

            return True
        except Exception as e:
            print(f"{RED}✗ Error creating path {path}: {e}{RESET}")
            return False

    def import_fixture(self, fixture_path, component_name):
        """Import a fixture file to AEM"""
        try:
            # Read fixture content
            with open(fixture_path, 'r', encoding='utf-8') as f:
                fixture_xml = f.read()

            # Ensure base path exists
            self.create_path(BASE_PATH)

            # Component-specific path
            component_path = f"{BASE_PATH}/{component_name}"

            # Create component path
            self.create_path(component_path)

            # Upload fixture content
            import_url = f"{self.url}{component_path}.html"

            files = {
                'file': ('fixture.xml', fixture_xml, 'application/xml')
            }

            print(f"{YELLOW}  ↳ Uploading fixture for {component_name}...{RESET}")
            response = self.session.post(import_url, files=files, timeout=10)

            if response.status_code in [200, 201, 204]:
                print(f"{GREEN}✓ {component_name} deployed{RESET}")
                return True
            else:
                print(f"{RED}✗ {component_name} failed (HTTP {response.status_code}){RESET}")
                return False

        except Exception as e:
            print(f"{RED}✗ Error deploying {component_name}: {e}{RESET}")
            return False

    def deploy_all_fixtures(self):
        """Deploy all fixture files"""
        print(f"\n{BLUE}{'='*60}{RESET}")
        print(f"{BLUE}AEM Content Fixture Deployment{RESET}")
        print(f"{BLUE}{'='*60}{RESET}\n")

        # Find all fixture files
        fixture_files = []
        fixtures_path = Path(FIXTURES_DIR)

        for fixture in sorted(fixtures_path.glob("*/content-fixtures/*-fixtures.xml")):
            # Extract component name from path
            component_name = fixture.parent.parent.name
            fixture_files.append((str(fixture), component_name))

        if not fixture_files:
            print(f"{RED}✗ No fixture files found in {FIXTURES_DIR}{RESET}")
            return False

        print(f"Found {len(fixture_files)} fixture files:\n")

        # Deploy each fixture
        deployed = 0
        failed = 0

        for fixture_path, component_name in fixture_files:
            print(f"{YELLOW}Deploying: {component_name}{RESET}")

            if self.import_fixture(fixture_path, component_name):
                deployed += 1
            else:
                failed += 1

            time.sleep(0.5)  # Small delay between uploads

        # Summary
        print(f"\n{BLUE}{'='*60}{RESET}")
        print(f"Deployment Summary:")
        print(f"  {GREEN}✓ Deployed: {deployed}{RESET}")
        print(f"  {RED}✗ Failed: {failed}{RESET}")
        print(f"  Total: {deployed + failed}")
        print(f"{BLUE}{'='*60}{RESET}\n")

        return failed == 0

    def verify_deployment(self):
        """Verify deployed content"""
        print(f"{BLUE}Verifying deployment...{RESET}\n")

        try:
            # Check if base path exists
            check_url = f"{self.url}{BASE_PATH}.json"
            response = self.session.get(check_url, timeout=5)

            if response.status_code == 200:
                print(f"{GREEN}✓ Style guide base path exists{RESET}")

                # Count deployed components
                data = response.json()
                children = data.get('children', [])
                print(f"{GREEN}✓ Found {len(children)} component pages{RESET}\n")

                # List components
                for child in sorted(children):
                    print(f"  ✓ {child}")

                return True
            else:
                print(f"{RED}✗ Style guide path not found (HTTP {response.status_code}){RESET}")
                return False

        except Exception as e:
            print(f"{RED}✗ Verification failed: {e}{RESET}")
            return False

def main():
    print(f"{BLUE}AEM Content Fixture Auto-Deployment{RESET}")
    print(f"Target: {AEM_URL}\n")

    # Create deployer
    deployer = AEMDeployer(AEM_URL, AEM_USER, AEM_PASS)

    # Test connection
    if not deployer.test_connection():
        print(f"\n{RED}Cannot reach AEM. Is it running at {AEM_URL}?{RESET}")
        sys.exit(1)

    # Deploy fixtures
    if deployer.deploy_all_fixtures():
        print(f"{GREEN}Deployment completed successfully!{RESET}")

        # Verify
        print()
        if deployer.verify_deployment():
            print(f"\n{GREEN}✓ All fixtures deployed and verified!{RESET}")
            print(f"\nNext step: Run tests")
            print(f"  env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4")
            return 0
        else:
            print(f"\n{YELLOW}Deployment completed but verification shows no content.{RESET}")
            print(f"Check AEM logs for details.")
            return 1
    else:
        print(f"{RED}Deployment failed. Check errors above.{RESET}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
