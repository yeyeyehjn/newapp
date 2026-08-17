<#
.SYNOPSIS
  一键部署：提交源码到 main，GitHub Actions 自动构建并部署到 Pages

.DESCRIPTION
  部署流程：
  1. 在 main 分支提交并推送源码
  2. GitHub Actions 自动触发构建（npm run build）并部署到 GitHub Pages
  3. 无需手动构建或操作 gh-pages 分支

  前提：GitHub 仓库 Settings → Pages → Source 已设为 "GitHub Actions"

.PARAMETER CommitMessage
  main 分支的提交信息（必填）。

.EXAMPLE
  .\deploy.ps1 -CommitMessage "feat: 新增通知分类"
  .\deploy.ps1 -CommitMessage "fix: 修复工作台布局"
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$CommitMessage
)

$ErrorActionPreference = 'Stop'

function Write-Step { param($msg) Write-Host "`n[*] $msg" -ForegroundColor Cyan }
function Write-Ok   { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Err   { param($msg) Write-Host "[X] $msg" -ForegroundColor Red }

# 1. 前置检查：确保在 git 仓库且当前分支为 main
Write-Step "前置检查"
$currentBranch = git branch --show-current
if ($LASTEXITCODE -ne 0) { Write-Err "当前目录不是 git 仓库"; exit 1 }
if ($currentBranch -ne 'main') {
  Write-Err "当前分支是 '$currentBranch'，请先切换到 main 分支后再运行此脚本"
  exit 1
}
Write-Ok "当前分支: $currentBranch"

# 2. 提交并推送 main 源码
Write-Step "提交并推送 main 分支源码"
git add -A
if ($LASTEXITCODE -ne 0) { Write-Err "git add 失败"; exit 1 }

$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Write-Host "    工作区无改动，仅推送远程触发部署"
} else {
  git commit -m $CommitMessage
  if ($LASTEXITCODE -ne 0) { Write-Err "git commit 失败"; exit 1 }
}

git push origin main
if ($LASTEXITCODE -ne 0) { Write-Err "git push main 失败"; exit 1 }
Write-Ok "main 已推送到 origin/main"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " 推送完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "GitHub Actions 正在自动构建并部署..." -ForegroundColor Yellow
Write-Host "查看进度: https://github.com/yeyeyehjn/newapp/actions" -ForegroundColor Yellow
Write-Host "部署完成后访问: https://yeyeyehjn.github.io/newapp/" -ForegroundColor Yellow
Write-Host "（部署约需 1-2 分钟，访问时请用 Ctrl+F5 强制刷新）" -ForegroundColor Yellow
