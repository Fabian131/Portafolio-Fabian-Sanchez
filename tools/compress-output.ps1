# tools/compress-output.ps1 — token-saver output wrapper (RTK-independent fallback).
#
# RTK compresses OpenCode tool calls automatically after a restart. This script
# is the manual fallback for terminal work and for commands RTK does not cover.
#
# Usage:
#   . .\tools\compress-output.ps1          # load the `cx` function in this shell
#   cx { npm run build }                   # run a command, compress its output
#   cx { docker compose up } -MaxLines 60  # tighter budget
#
# Env overrides: CX_MAX_LINES (default 120), CX_MAX_BYTES (default 16384).

function cx {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory = $true, Position = 0)]
    [scriptblock]$Block,
    [int]$MaxLines = $(
      if ($env:CX_MAX_LINES) { [int]$env:CX_MAX_LINES } else { 120 }
    ),
    [int]$MaxBytes = $(
      if ($env:CX_MAX_BYTES) { [int]$env:CX_MAX_BYTES } else { 16384 }
    )
  )

  $raw = @(& $Block 2>&1)
  $text = ($raw | Out-String)

  if ($raw.Count -le $MaxLines -and $text.Length -le $MaxBytes) {
    $text.TrimEnd("`r", "`n")
    return
  }

  $headCount = [Math]::Ceiling($MaxLines / 2)
  $tailCount = [Math]::Floor($MaxLines / 2)
  $omitted = $raw.Count - ($headCount + $tailCount)

  "[cx] $($raw.Count) lines, $($text.Length) chars -> showing $headCount head + $tailCount tail"
  $raw | Select-Object -First $headCount
  "... [cx omitted $omitted lines] ..."
  $raw | Select-Object -Last $tailCount
}