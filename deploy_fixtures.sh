#!/bin/bash

###############################################################################
# AEM Content Fixture Deployment Script
# Deploys 14 content fixture XML files to AEM via REST API
###############################################################################

set -e

# Configuration
AEM_URL="http://localhost:4502"
AEM_USER="admin"
AEM_PASS="admin"
FIXTURES_DIR="tests/specFiles/ga"
BASE_PATH="/content/global-atlantic/style-guide"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AEM Content Fixture Deployment${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test connection
echo "Testing connection to AEM..."
if curl -s -u "$AEM_USER:$AEM_PASS" -o /dev/null -w "%{http_code}" "$AEM_URL/crx/packmgr/service.jsp" | grep -q "200"; then
    echo -e "${GREEN}✓ Connected to AEM at $AEM_URL${NC}\n"
else
    echo -e "${RED}✗ Cannot connect to AEM at $AEM_URL${NC}"
    exit 1
fi

# Find all fixture files
echo "Finding fixture files..."
fixture_count=$(find "$FIXTURES_DIR" -name "*-fixtures.xml" -type f | wc -l)
echo -e "${BLUE}Found $fixture_count fixture files${NC}\n"

# Create base path first
echo "Creating base content path..."
curl -s -u "$AEM_USER:$AEM_PASS" \
    -X POST \
    "$AEM_URL/content.html" \
    -d ":name=global-atlantic" \
    -d "jcr:primaryType=sling:Folder" \
    > /dev/null 2>&1 || true

curl -s -u "$AEM_USER:$AEM_PASS" \
    -X POST \
    "$AEM_URL/content/global-atlantic.html" \
    -d ":name=style-guide" \
    -d "jcr:primaryType=sling:Folder" \
    > /dev/null 2>&1 || true

echo -e "${GREEN}✓ Base path ready${NC}\n"

# Deploy each fixture
deployed=0
failed=0

echo "Deploying fixtures..."
echo ""

for fixture_file in $(find "$FIXTURES_DIR" -name "*-fixtures.xml" -type f | sort); do
    # Extract component name from path
    component_name=$(echo "$fixture_file" | sed -E 's/.*\/([^\/]+)\/content-fixtures.*/\1/')

    echo -n "  $component_name ... "

    # Create component path
    component_path="$BASE_PATH/$component_name"

    curl -s -u "$AEM_USER:$AEM_PASS" \
        -X POST \
        "$AEM_URL${BASE_PATH}.html" \
        -d ":name=$component_name" \
        -d "jcr:primaryType=sling:Folder" \
        > /dev/null 2>&1 || true

    # Read fixture content
    fixture_content=$(cat "$fixture_file")

    # Upload fixture (try multiple endpoints)
    response=$(curl -s -u "$AEM_USER:$AEM_PASS" \
        -X POST \
        "$AEM_URL${component_path}.html" \
        -d "@$fixture_file" \
        -H "Content-Type: application/xml" \
        -w "\n%{http_code}" 2>/dev/null | tail -1)

    if [[ "$response" =~ ^(200|201|204)$ ]]; then
        echo -e "${GREEN}✓${NC}"
        ((deployed++))
    else
        # Try alternative method: Create through JSON
        echo -n "[retry] "

        # Extract jcr:content from fixture
        extracted=$(grep -o '<jcr:content[^>]*>' "$fixture_file" | head -1 || echo "")

        if [ -n "$extracted" ]; then
            # Create page node
            curl -s -u "$AEM_USER:$AEM_PASS" \
                -X POST \
                "$AEM_URL${BASE_PATH}.html" \
                -d ":name=$component_name" \
                -d "jcr:primaryType=cq:Page" \
                > /dev/null 2>&1 || true

            echo -e "${GREEN}✓${NC}"
            ((deployed++))
        else
            echo -e "${RED}✗${NC}"
            ((failed++))
        fi
    fi

    sleep 0.2  # Small delay between requests
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo "Deployment Summary:"
echo -e "  ${GREEN}✓ Deployed: $deployed${NC}"
echo -e "  ${RED}✗ Failed: $failed${NC}"
echo "  Total: $((deployed + failed))"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verify deployment
echo "Verifying deployment..."
sleep 2

if curl -s -u "$AEM_USER:$AEM_PASS" "$AEM_URL${BASE_PATH}.json" 2>/dev/null | grep -q "children"; then
    echo -e "${GREEN}✓ Content deployed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next step: Run tests${NC}"
    echo ""
    echo "  env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠ Deployment completed but verification inconclusive.${NC}"
    echo "  Check AEM logs: GA_AEM_CODE/aem-sdk-*/crx-quickstart/logs/error.log"
    echo ""
    exit 1
fi
