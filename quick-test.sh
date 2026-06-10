#!/bin/bash
# Quick test runner with optimized settings

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo "Usage: ./quick-test.sh [option]"
    echo ""
    echo "Options:"
    echo "  smoke       Run @smoke tests (fastest, 5-10 min)"
    echo "  component   Run specific component tests (2-5 min)"
    echo "  chromium    Run all tests on chromium only (15-20 min)"
    echo "  all         Run all browsers (requires AEM, ~3 hours)"
    echo "  debug       Run single test with PWDEBUG=1"
    echo ""
    echo "Examples:"
    echo "  ./quick-test.sh smoke"
    echo "  ./quick-test.sh component button"
    echo "  ./quick-test.sh chromium"
}

if [ $# -eq 0 ]; then
    print_usage
    exit 1
fi

case "$1" in
    smoke)
        echo -e "${BLUE}Running @smoke tests (fastest path)...${NC}"
        env=local npx playwright test --grep "@smoke" --project chromium --workers 4
        ;;

    component)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: specify component name${NC}"
            echo "Example: ./quick-test.sh component button"
            exit 1
        fi
        echo -e "${BLUE}Running tests for component: $2${NC}"
        env=local npx playwright test "tests/specFiles/ga/$2/" --project chromium --workers 4
        ;;

    chromium)
        echo -e "${BLUE}Running all tests on chromium (faster than all browsers)...${NC}"
        echo -e "${YELLOW}Ensure AEM is running on localhost:4502${NC}"
        env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4
        ;;

    all)
        echo -e "${YELLOW}Running all browsers (slow, requires AEM)...${NC}"
        echo -e "${YELLOW}This will take ~3 hours. Press Ctrl+C to cancel.${NC}"
        sleep 3
        env=local npx playwright test tests/specFiles/ga/ --workers 2
        ;;

    debug)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: specify test file${NC}"
            echo "Example: ./quick-test.sh debug tests/specFiles/ga/button/button.author.spec.ts"
            exit 1
        fi
        echo -e "${BLUE}Running with PWDEBUG=1 (opens inspector)...${NC}"
        PWDEBUG=1 env=local npx playwright test "$2" --project chromium --workers 1
        ;;

    *)
        print_usage
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓ Test run completed${NC}"
