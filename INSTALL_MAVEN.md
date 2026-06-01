# Maven Installation Guide

**Status**: Maven not currently installed  
**Action**: Install Maven 3.9.6  

---

## Quick Install (Recommended)

### Step 1: Download Maven

Download from: https://maven.apache.org/download.cgi

**File to download**:
- Apache Maven 3.9.6 (or latest)
- Windows binary: `apache-maven-3.9.6-bin.zip`

Save to: `C:\Users\PuneethAM\Downloads\apache-maven-3.9.6-bin.zip`

### Step 2: Extract Maven

1. Open File Explorer
2. Navigate to `C:\Users\PuneethAM\Downloads`
3. Right-click `apache-maven-3.9.6-bin.zip`
4. Select "Extract All..."
5. Extract to: `C:\Program Files\`
6. You should now have: `C:\Program Files\apache-maven-3.9.6`

### Step 3: Verify Installation

Open PowerShell and run:

```powershell
& "C:\Program Files\apache-maven-3.9.6\bin\mvn.cmd" --version
```

Should show:
```
Apache Maven 3.9.6
```

---

## Add Maven to System PATH (Optional but Recommended)

### Step 1: Open Environment Variables

1. Press `Win + R`
2. Type: `sysdm.cpl`
3. Click OK

### Step 2: Add MAVEN_HOME

1. Click "Environment Variables" button
2. Click "New" under "User variables"
3. Variable name: `MAVEN_HOME`
4. Variable value: `C:\Program Files\apache-maven-3.9.6`
5. Click OK

### Step 3: Add to PATH

1. In Environment Variables, select `PATH`
2. Click "Edit"
3. Click "New"
4. Add: `%MAVEN_HOME%\bin` (or `C:\Program Files\apache-maven-3.9.6\bin`)
5. Click OK, OK, OK

### Step 4: Restart Terminal

Close all PowerShell/Command Prompt windows and reopen them.

### Step 5: Verify

```powershell
mvn --version
# Should show: Apache Maven 3.9.6
```

---

## Once Maven is Installed

### Build AEM

```powershell
cd C:\Users\PuneethAM\GA_AEM_CODE\kkr-aem

mvn clean install -PautoInstallSinglePackage `
  -DskipTests `
  -Dcheckstyle.skip=true `
  -q
```

**Estimated time**: 5-10 minutes (first run)

### Run Tests

```powershell
cd C:\Users\PuneethAM\GATestFramework-main

$env:env = 'local'
npx playwright test tests/specFiles/ga/ --project chromium
```

### View Results

```powershell
npx playwright show-report
```

---

## Troubleshooting

### Maven command not found

**Solution**: Maven not in PATH. Either:
1. Use full path: `C:\Program Files\apache-maven-3.9.6\bin\mvn.cmd clean install`
2. Or add to PATH as described above and restart terminal

### Build fails with "JAVA_HOME not set"

**Solution**: Java not in PATH. Install JDK 11+ from:
https://www.oracle.com/java/technologies/downloads/

### Network errors during build

**Solution**: Check firewall/proxy settings. Maven needs network access to download dependencies.

### Build takes very long

**Normal**: First build downloads all dependencies. Subsequent builds are much faster.

---

## Direct Maven Usage (Without PATH)

If you don't want to add Maven to PATH, use the full path:

```powershell
$mvn = "C:\Program Files\apache-maven-3.9.6\bin\mvn.cmd"

& $mvn clean install -PautoInstallSinglePackage -DskipTests -Dcheckstyle.skip=true
```

---

## After Maven is Ready

Once Maven is installed and accessible:

1. **Build & Deploy AEM**
   ```powershell
   cd C:\Users\PuneethAM\GA_AEM_CODE\kkr-aem
   mvn clean install -PautoInstallSinglePackage -DskipTests -Dcheckstyle.skip=true
   ```

2. **Verify Deployment**
   ```powershell
   curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide/components/button.html
   # Should return 200 OK (not 404)
   ```

3. **Run Full Test Suite**
   ```powershell
   cd C:\Users\PuneethAM\GATestFramework-main
   $env:env = 'local'
   npx playwright test tests/specFiles/ga/ --project chromium
   ```

4. **View Results**
   ```powershell
   npx playwright show-report
   ```

---

## Next Steps

1. Download Maven from https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\apache-maven-3.9.6`
3. Verify: `C:\Program Files\apache-maven-3.9.6\bin\mvn.cmd --version`
4. Run build: `mvn clean install -PautoInstallSinglePackage`
5. Run tests: `npx playwright test tests/specFiles/ga/`

---

**Timeline**: 
- 10 min to download & extract Maven
- 10 min to add to PATH (optional)
- 10 min to build AEM
- 5-10 min to run tests
- **Total**: ~25-35 minutes

Once Maven is ready, you'll have fully automated test execution! 🚀
