@echo off
REM ============================================================================
REM SPRINT-WISE AUTOMATION TEST RUNNER
REM
REM Double-click this file to start the interactive test runner
REM
REM Features:
REM ✅ Choose sprint (1-16) or all sprints
REM ✅ Choose test type (smoke, regression, sanity, all)
REM ✅ Choose environment (local, dev, qa, uat, prod)
REM ✅ Automatic report generation
REM ✅ Results open in browser
REM
REM ============================================================================

cd /d "%~dp0"

REM Run PowerShell script
powershell.exe -ExecutionPolicy Bypass -File "run-sprint-automation.ps1"

pause
