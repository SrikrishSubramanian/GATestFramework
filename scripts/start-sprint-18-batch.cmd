@echo off
REM Sprint 18 Batch Test Generation - Windows Batch Script
REM Usage: set JIRA_API_TOKEN=your-token && start-sprint-18-batch.cmd [environment] [batch-size]

setlocal enabledelayedexpansion

REM Configuration
if not defined JIRA_API_TOKEN (
    echo.
    echo ╔════════════════════════════════════════════════════════════════════╗
    echo ║  ERROR: JIRA_API_TOKEN not set                                     ║
    echo ╚════════════════════════════════════════════════════════════════════╝
    echo.
    echo To proceed with batch generation, you MUST set JIRA_API_TOKEN:
    echo.
    echo 1. Get your token from: https://id.atlassian.com/manage-profile/security/api-tokens
    echo.
    echo 2. Set the environment variable:
    echo    set JIRA_API_TOKEN=your-api-token-here
    echo.
    echo 3. Run this script:
    echo    %~nx0 [environment] [batch-size]
    echo.
    echo Example:
    echo    set JIRA_API_TOKEN=ABC123XYZ
    echo    %~nx0 local 3
    echo.
    exit /b 1
)

set ENVIRONMENT=%1
if not defined ENVIRONMENT set ENVIRONMENT=local

set BATCH_SIZE=%2
if not defined BATCH_SIZE set BATCH_SIZE=3

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║              Sprint 18 Batch Test Generation                       ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.
echo Configuration:
echo   Environment: %ENVIRONMENT%
echo   Batch Size: %BATCH_SIZE%
echo   Jira Token: ✓ Set
echo.
echo Running: node scripts/run-sprint-18-batch.js %ENVIRONMENT% %BATCH_SIZE%
echo.

node scripts/run-sprint-18-batch.js %ENVIRONMENT% %BATCH_SIZE%

endlocal
