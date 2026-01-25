#!/usr/bin/env pwsh
# Common PowerShell functions analogous to common.sh

function Get-RepoRoot {
    try {
        $result = git rev-parse --show-toplevel 2>$null
        if ($LASTEXITCODE -eq 0) {
            return $result
        }
    } catch {
        # Git command failed
    }
    
    # Fall back to script location for non-git repos
    return (Resolve-Path (Join-Path $PSScriptRoot "../../..")).Path
}

function Get-CurrentBranch {
    # First check if SPECIFY_FEATURE environment variable is set
    if ($env:SPECIFY_FEATURE) {
        return $env:SPECIFY_FEATURE
    }
    
    # Then check git if available
    try {
        $result = git rev-parse --abbrev-ref HEAD 2>$null
        if ($LASTEXITCODE -eq 0) {
            return $result
        }
    } catch {
        # Git command failed
    }
    
    # For non-git repos, try to find the latest feature directory
    $repoRoot = Get-RepoRoot
    $specsDir = Join-Path $repoRoot "specs"
    
    if (Test-Path $specsDir) {
        $latestFeature = ""
        $highest = 0
        
        Get-ChildItem -Path $specsDir -Directory | ForEach-Object {
            if ($_.Name -match '^(\d{3})-') {
                $num = [int]$matches[1]
                if ($num -gt $highest) {
                    $highest = $num
                    $latestFeature = $_.Name
                }
            }
        }
        
        if ($latestFeature) {
            return $latestFeature
        }
    }
    
    # Final fallback
    return "main"
}

function Test-HasGit {
    try {
        git rev-parse --show-toplevel 2>$null | Out-Null
        return ($LASTEXITCODE -eq 0)
    } catch {
        return $false
    }
}

# Get next available feature number by scanning existing specs directories
function Get-NextFeatureNumber {
    param([string]$RepoRoot)

    $specsDir = Join-Path $RepoRoot "specs"
    $highest = 0

    if (Test-Path $specsDir) {
        Get-ChildItem -Path $specsDir -Directory -ErrorAction SilentlyContinue | ForEach-Object {
            if ($_.Name -match '^(\d{3})-') {
                $num = [int]$matches[1]
                if ($num -gt $highest) {
                    $highest = $num
                }
            }
        }
    }

    return "{0:D3}" -f ($highest + 1)
}

# Normalize branch name to a valid feature name (with numeric prefix)
# If branch already has prefix, return as-is; otherwise generate one
function ConvertTo-FeatureName {
    param(
        [string]$Branch,
        [string]$RepoRoot
    )

    # If already has numeric prefix, return as-is
    if ($Branch -match '^[0-9]{3}-') {
        return $Branch
    }

    # Generate new feature name with next available number
    $nextNumber = Get-NextFeatureNumber -RepoRoot $RepoRoot
    return "$nextNumber-$Branch"
}

function Test-FeatureBranch {
    param(
        [string]$Branch,
        [bool]$HasGit = $true,
        [string]$RepoRoot = ""
    )

    # For non-git repos, skip branch validation
    if (-not $HasGit) {
        Write-Warning "[specify] Warning: Git repository not detected; skipped branch validation"
        return $true
    }

    # No longer error out, just show a notice when branch doesn't follow convention
    if ($Branch -notmatch '^[0-9]{3}-') {
        if ($RepoRoot) {
            $suggestedName = ConvertTo-FeatureName -Branch $Branch -RepoRoot $RepoRoot
            Write-Warning "[specify] Notice: Branch '$Branch' doesn't follow naming convention."
            Write-Warning "[specify] Using '$suggestedName' as spec directory name."
        }
    }
    return $true
}

function Get-FeatureDir {
    param([string]$RepoRoot, [string]$Branch)
    Join-Path $RepoRoot "specs/$Branch"
}

function Get-FeaturePathsEnv {
    $repoRoot = Get-RepoRoot
    $currentBranch = Get-CurrentBranch
    $hasGit = Test-HasGit

    # Try to find existing spec directory first
    $featureDir = Get-FeatureDir -RepoRoot $repoRoot -Branch $currentBranch

    # If no existing spec directory found, use normalized feature name
    if (-not (Test-Path $featureDir -PathType Container)) {
        $featureName = ConvertTo-FeatureName -Branch $currentBranch -RepoRoot $repoRoot
        $featureDir = Join-Path $repoRoot "specs/$featureName"
    }

    [PSCustomObject]@{
        REPO_ROOT     = $repoRoot
        CURRENT_BRANCH = $currentBranch
        HAS_GIT       = $hasGit
        FEATURE_DIR   = $featureDir
        FEATURE_SPEC  = Join-Path $featureDir 'spec.md'
        IMPL_PLAN     = Join-Path $featureDir 'plan.md'
        TASKS         = Join-Path $featureDir 'tasks.md'
        RESEARCH      = Join-Path $featureDir 'research.md'
        DATA_MODEL    = Join-Path $featureDir 'data-model.md'
        QUICKSTART    = Join-Path $featureDir 'quickstart.md'
        CONTRACTS_DIR = Join-Path $featureDir 'contracts'
    }
}

function Test-FileExists {
    param([string]$Path, [string]$Description)
    if (Test-Path -Path $Path -PathType Leaf) {
        Write-Output "  ✓ $Description"
        return $true
    } else {
        Write-Output "  ✗ $Description"
        return $false
    }
}

function Test-DirHasFiles {
    param([string]$Path, [string]$Description)
    if ((Test-Path -Path $Path -PathType Container) -and (Get-ChildItem -Path $Path -ErrorAction SilentlyContinue | Where-Object { -not $_.PSIsContainer } | Select-Object -First 1)) {
        Write-Output "  ✓ $Description"
        return $true
    } else {
        Write-Output "  ✗ $Description"
        return $false
    }
}

