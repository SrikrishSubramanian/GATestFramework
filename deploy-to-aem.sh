#!/bin/bash

echo "=== CREATING AEM DEPLOYMENT PACKAGE ==="
echo ""

# Create deployment package
DEPLOY_PKG="/tmp/kkr-aem-components.zip"
SOURCE_DIR="GA_AEM_CODE/kkr-aem/ui.apps/src/main/content"

echo "📦 Building deployment package..."

# Create ZIP with proper AEM content structure
cd "$SOURCE_DIR" && \
zip -r "$DEPLOY_PKG" jcr_root/ \
  -x "*.git*" "*target*" "*.lock" \
  > /dev/null 2>&1

echo "✓ Package created: $DEPLOY_PKG"
echo "  Size: $(du -h $DEPLOY_PKG | cut -f1)"

echo ""
echo "=== UPLOAD INSTRUCTIONS ==="
echo ""
echo "1. Open AEM Package Manager:"
echo "   http://localhost:4502/crx/packmgr/"
echo ""
echo "2. Click 'Upload Package'"
echo ""
echo "3. Select: $(pwd)/$DEPLOY_PKG"
echo ""
echo "4. Once uploaded, click 'Install'"
echo ""
echo "5. Verify:"
echo "   http://localhost:4502/content/global-atlantic/style-guide/components/button.html"

# Also create GA components package
echo ""
echo "=== CREATING GA COMPONENTS PACKAGE ==="

SOURCE_GA="GA_AEM_CODE/kkr-aem/ui.apps.ga/src/main/content"
DEPLOY_GA="/tmp/ga-components.zip"

cd "$SOURCE_GA" && \
zip -r "$DEPLOY_GA" jcr_root/ \
  -x "*.git*" "*target*" "*.lock" \
  > /dev/null 2>&1

echo "✓ GA Package created: $DEPLOY_GA"
echo "  Size: $(du -h $DEPLOY_GA | cut -f1)"

echo ""
echo "=== READY FOR DEPLOYMENT ==="
echo "Two packages created:"
echo "  1. $DEPLOY_PKG (Base components)"
echo "  2. $DEPLOY_GA (GA-specific components)"

