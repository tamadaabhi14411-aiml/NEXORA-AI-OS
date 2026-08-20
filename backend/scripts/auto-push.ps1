$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $repoRoot

$status = git status --porcelain

if (-not $status) {
    Write-Host "No changes to push."
    exit 0
}

git add src package.json package-lock.json .gitignore scripts

if ($LASTEXITCODE -ne 0) {
    throw "Git add failed. Auto-push stopped."
}

git diff --cached --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "No allowed changes to commit."
    exit 0
}

git commit -m "chore: auto-save backend work"

if ($LASTEXITCODE -ne 0) {
    throw "Git commit failed. Auto-push stopped."
}

git pull --rebase origin backend-dev

if ($LASTEXITCODE -ne 0) {
    throw "Git pull failed. Auto-push stopped."
}

git push origin backend-dev

if ($LASTEXITCODE -ne 0) {
    throw "Git push failed."
}

Write-Host "Backend work pushed successfully."
