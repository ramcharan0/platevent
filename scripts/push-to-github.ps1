Param(
    [string]$remoteUrl = 'https://github.com/ramcharan0/platevent.git'
)

Write-Host "Preparing to push workspace to remote: $remoteUrl"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git is not installed or not in PATH. Install Git and retry."
    exit 1
}

# Ensure we operate from the project root (folder above this script)
Push-Location -LiteralPath (Resolve-Path (Join-Path $PSScriptRoot ".."))
try {
    $cwd = Get-Location
    Write-Host "Working in: $cwd"

    if (-not (git rev-parse --is-inside-work-tree 2>$null)) {
        git init
        Write-Host "Initialized new git repository."
    }

    # remove existing origin if present (safe to ignore errors)
    git remote remove origin 2>$null
    git remote add origin $remoteUrl

    git add --all

    # create an initial commit if there are no commits
    $hasCommits = git rev-parse --verify HEAD 2>$null
    if (-not $hasCommits) {
        git commit -m "chore: initial commit - workspace export" -q
    } else {
        try {
            git commit -m "chore: workspace update" -q
        } catch {
            Write-Host "No changes to commit."
        }
    }

    git branch -M main 2>$null

    Write-Host "Pushing to $remoteUrl (you may be prompted for credentials)..."
    git push -u origin main
    Write-Host "Push complete."
}
finally {
    Pop-Location
}
