# Maven Deployment Guide - AEM Build & Deployment

**Status**: Maven not found in system PATH  
**Action Required**: Configure Maven access  

---

## Current Situation

Maven is installed on your system but **not accessible via command line** because:
- It's either not in the system `PATH` environment variable
- Or it's installed in a non-standard location
- PowerShell and Bash cannot find the `mvn` command

## Solution: Configure Maven Access

### Option 1: Add Maven to System PATH (Recommended)

#### Step 1: Find Maven Installation
```powershell
# In PowerShell, check common locations:
Test-Path "C:\Program Files\apache-maven-*"
Test-Path "C:\tools\maven"
Test-Path "C:\Maven"
Get-ChildItem "C:\Program Files" | Where-Object {$_.Name -like "*maven*"}
```

#### Step 2: Add to System PATH
1. Open **System Properties** → **Environment Variables**
2. Click **Edit environment variables for your account** (or system-wide)
3. Click **New** and add:
   - Variable name: `MAVEN_HOME`
   - Variable value: `C:\path\to\apache-maven-3.x.x` (your actual Maven path)
4. Add Maven `bin` to PATH:
   - Find the **PATH** variable
   - Click **Edit** → **New**
   - Add: `%MAVEN_HOME%\bin` (or full path: `C:\path\to\apache-maven-3.x.x\bin`)
5. Click **OK** and close all windows
6. **Restart your terminal/PowerShell**

#### Step 3: Verify
```powershell
mvn --version
# Should show: Apache Maven 3.x.x
```

### Option 2: Use Full Path to Maven

If you know Maven's location, build using the full path:

```powershell
# Example (adjust path as needed):
& "C:\Program Files\apache-maven-3.9.6\bin\mvn.cmd" clean install -PautoInstallSinglePackage -DskipTests -Dcheckstyle.skip=true
```

### Option 3: Use Maven Wrapper (If Available)

Some projects include a Maven wrapper:

```powershell
cd C:\Users\PuneethAM\GA_AEM_CODE\kkr-aem

# On Windows:
mvnw.cmd clean install -PautoInstallSinglePackage -DskipTests -Dcheckstyle.skip=true

# On Linux/Mac:
./mvnw clean install -PautoInstallSinglePackage -DskipTests -Dcheckstyle.skip=true
```

---

## Build & Deploy Steps

Once Maven is accessible:

### Step 1: Build AEM Package

```powershell
cd C:\Users\PuneethAM\GA_AEM_CODE\kkr-aem

mvn clean install -PautoInstallSinglePackage `
  -DskipTests `
  -Dcheckstyle.skip=true `
  -q

# Output: Built packages will be deployed to localhost:4502
```

**Build Time**: ~5-10 minutes (first time longer, subsequent faster)

**What Happens**:
1. ✅ Code compiled
2. ✅ Bundles created
3. ✅ Packages built
4. ✅ Packages deployed to AEM Author (localhost:4502)
5. ✅ Style guide pages published

### Step 2: Verify Deployment

```powershell
# Check if AEM received packages
curl -u admin:admin http://localhost:4502/crx/packmgr/service.jsp

# Check if style guide pages exist
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide/components/button.html
# Should return: 200 OK (not 404)
```

### Step 3: Run Tests

```powershell
cd C:\Users\PuneethAM\GATestFramework-main

$env:env = 'local'
npx playwright test tests/specFiles/ga/ --project chromium
```

**Expected Result**: ✅ All 150+ tests PASS

---

## Automated Pipeline (Easiest Once Maven Works)

Once Maven is configured, use the automated pipeline:

```powershell
cd C:\Users\PuneethAM\GATestFramework-main
.\scripts\deploy-and-test.ps1 -TestEnv local
```

This automatically:
1. Builds AEM
2. Deploys packages
3. Runs tests
4. Generates reports
5. Displays summary

---

## Troubleshooting

### Maven still not found after adding to PATH

**Solution**: Restart PowerShell/Terminal completely

```powershell
# Close and reopen PowerShell, then verify:
$env:PATH
# Should contain your Maven bin directory
```

### Maven build fails

**Common causes**:
- Java not in PATH (need JDK 11+)
- Corrupted local Maven repository (~/.m2)
- Network issues downloading dependencies

**Solutions**:
```powershell
# Verify Java is installed
java -version

# Clear Maven cache and rebuild
mvn clean install -DskipTests -Dcheckstyle.skip=true -U

# Specify Maven settings
mvn -s C:\path\to\settings.xml clean install
```

### AEM deployment fails

**Verify AEM is running**:
```powershell
curl -u admin:admin http://localhost:4502
# Should return: 401 Unauthorized (auth required, which is good)
```

If AEM isn't responding, start it before building.

---

## Quick Reference Commands

```powershell
# Find Maven installation
Get-ChildItem "C:\Program Files" -Recurse | Where-Object {$_.Name -eq "mvn.cmd"}

# Set Maven home (temporary, for current session)
$env:MAVEN_HOME = "C:\Program Files\apache-maven-3.9.6"
$env:PATH += ";$env:MAVEN_HOME\bin"

# Build AEM
mvn clean install -PautoInstallSinglePackage -DskipTests -Dcheckstyle.skip=true

# Run tests after deployment
$env:env = 'local'
npx playwright test tests/specFiles/ga/

# View test report
npx playwright show-report
```

---

## Expected Outcomes

### After Successful Build & Deployment

✅ **AEM Updated**
- Style guide pages published
- Components available for testing
- localhost:4502 has new content

✅ **Tests Pass**
- 150+ test cases PASS
- 0 failures (when pages exist)
- HTML report generated
- Full coverage verified

✅ **Framework Ready**
- Tests can run on demand
- CI/CD pipeline functional
- Reports available
- Metrics captured

---

## Next Steps

1. **Locate Maven** - Find where it's installed
2. **Add to PATH** - Update system environment variables
3. **Verify** - Run `mvn --version`
4. **Build** - Run AEM build
5. **Deploy** - Wait for deployment to AEM
6. **Test** - Run full test suite
7. **Report** - Review results

---

## Support

If Maven installation is complex, you can:

1. **Use pre-built packages** - Deploy via AEM Package Manager UI
2. **Use Docker** - Run AEM in container with Maven pre-installed
3. **Use CI/CD** - Let Bitbucket Pipelines build (Maven already configured there)
4. **Manual deployment** - Deploy packages directly via Package Manager

---

**Timeline**: 5 min (Maven setup) + 10 min (build) + 5 min (tests) = **20 min total**

Once Maven is configured, the entire process becomes automated! 🚀
