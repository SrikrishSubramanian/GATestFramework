#!/usr/bin/env python3

"""
Framework Refactoring Script
Applies proper console-capture + report-enhancer pattern to all spec files
"""

import os
import re
from pathlib import Path

SPEC_DIR = Path(__file__).parent.parent / 'tests' / 'specFiles' / 'ga'

stats = {
    'total': 0,
    'fixed': 0,
    'skipped': 0,
    'errors': 0,
}

def get_import_depth(file_path):
    """Determine relative import path depth"""
    parts = str(file_path).split(os.sep)
    ga_index = parts.index('ga') if 'ga' in parts else -1
    if ga_index >= 0 and len(parts) - ga_index > 3:  # ga/component/file.spec.ts = 3 parts
        return '../../'
    return '../../../'

def fix_spec_file(file_path):
    """Add ConsoleCapture + report-enhancer to a spec file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # 1. Add report-enhancer import if missing
        if 'attachConsoleCapture' not in content:
            depth = get_import_depth(file_path)
            import_line = f"import {{ attachConsoleCapture, annotateEnvironment }} from '{depth}utils/infra/report-enhancer';"

            # Find last import line
            import_matches = list(re.finditer(r"^import .* from ['\"].+['\"];?$", content, re.MULTILINE))
            if import_matches:
                last_import = import_matches[-1]
                insert_pos = last_import.end()
                content = content[:insert_pos] + '\n' + import_line + content[insert_pos:]

        # 2. Add capture variable if missing
        if 'let capture: ConsoleCapture;' not in content:
            # Find insertion point (after imports, before first const or test)
            pattern = r'\nconst [A-Z_]+ = |^test\.'
            match = re.search(pattern, content, re.MULTILINE)
            if match:
                insert_pos = match.start()
                content = content[:insert_pos] + '\nlet capture: ConsoleCapture;\n' + content[insert_pos:]

        # 3. Update beforeEach to initialize capture
        before_each_pattern = r'test\.beforeEach\s*\(\s*async\s*\(\s*{\s*page\s*}\s*\)\s*=>\s*{([^}]*(?:{[^}]*}[^}]*)*)'
        match = re.search(before_each_pattern, content, re.DOTALL)
        if match and 'capture = new ConsoleCapture' not in match.group(1):
            body = match.group(1)
            # Add capture init before closing
            capture_init = '\n  capture = new ConsoleCapture(page);\n  capture.start();'
            body_fixed = body.rstrip() + capture_init
            content = content[:match.start(1)] + body_fixed + content[match.end(1):]

        # 4. Add afterEach if missing
        if 'test.afterEach' not in content:
            # Find where to add (after beforeEach)
            before_each_end = content.find('});', content.find('test.beforeEach'))
            if before_each_end > 0:
                after_each_block = '''

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});'''
                content = content[:before_each_end + 3] + after_each_block + content[before_each_end + 3:]

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            stats['fixed'] += 1
            print(f"✓ Fixed: {file_path.relative_to(SPEC_DIR.parent)}")
        else:
            stats['skipped'] += 1
    except Exception as e:
        stats['errors'] += 1
        print(f"✗ Error: {file_path}: {e}")

def main():
    print("🔧 Framework Refactoring Script\n")
    print(f"Scanning: {SPEC_DIR}\n")

    # Find all .author.spec.ts files
    author_specs = list(SPEC_DIR.rglob('*.author.spec.ts'))

    print(f"Found {len(author_specs)} author specs\n")

    for spec in author_specs:
        stats['total'] += 1
        fix_spec_file(spec)

    # Print summary
    print(f"\n{'=' * 60}")
    print(f"📊 Summary:")
    print(f"   Total scanned:  {stats['total']}")
    print(f"   Fixed:          {stats['fixed']}")
    print(f"   Skipped:        {stats['skipped']}")
    print(f"   Errors:         {stats['errors']}")
    print(f"{'=' * 60}")

if __name__ == '__main__':
    main()
