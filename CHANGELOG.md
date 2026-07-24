# Changelog

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Claude Code plugin** — ccbar can now be installed as a Claude Code plugin:
  `/plugin marketplace add lakpriya1s/ccbar`, then `/plugin install ccbar@ccbar`.
  Adds `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and a
  `/ccbar-setup` slash command that wires up the status line.
- **`ccbar install`** — copies ccbar to `~/.local/bin` and wires it into
  `~/.claude/settings.json` (merging, never clobbering, with a `.bak` backup).
  Symmetric with `ccbar uninstall`; this is what `/ccbar-setup` runs.

## [0.3.0] - 2026-07-24

### Added
- **`ccbar demo stats`** and **`ccbar demo history`** — preview the two usage
  panels with sample data (no real usage or history required). Plain `ccbar demo`
  still previews the status line.
- **`ccbar history`** — usage trends over the last 7 days: a sparkline of daily
  5-hour peaks, current weekly usage, a per-day table (peak 5h/7d %, estimated
  cost), and a measured burn rate. `render` records a throttled snapshot (≤1/min)
  to `${XDG_STATE_HOME:-~/.local/state}/ccbar/history.tsv`, bounded in size.
  Disable with `CCBAR_HISTORY=0`.
- **`ccbar stats`** — an expanded, on-demand usage panel (session, weekly,
  context, cost, reset countdowns, and pace) for the terminal. Since ccbar makes
  no network calls, `render` now caches each payload to
  `${XDG_CACHE_HOME:-~/.cache}/ccbar/last.json`, and `stats` reads that cache
  (stamped with its age) or accepts piped JSON.
- **Session cost** on line 1 (`CCBAR_SHOW_COST`, default off) — reads
  `cost.total_cost_usd` from Claude Code's status JSON and shows it as `$0.42`.
- **Idle 5-hour window** state — when the rolling 5-hour window hasn't started
  yet (rate-limit data present but no `five_hour` block), the 5h segment shows
  `5h idle` instead of being hidden, so you can tell the clock isn't running.
- **Burn-rate warning** (`CCBAR_SHOW_BURN`, default off) — when your current
  pace projects to exhaust the 5-hour or 7-day limit *before* it resets, ccbar
  appends a `⚠ <time>` estimate to that bar. Inferred from `used_percentage`
  and `resets_at`; no network calls.
- Two new wizard prompts (`ccbar config`) for the cost and burn-rate options;
  the gallery preserves both when applying a preset.

## [0.2.1] - 2026-07-22

### Added
- npm distribution: `npx ccbar-cli` installs ccbar and runs the setup wizard,
  and forwards subcommands (`npx ccbar-cli gallery`, etc.). A small Node wrapper
  (`cli.js`) copies the bundled bash script to `~/.local/bin` and wires
  `~/.claude/settings.json` — no `jq` needed for the settings merge.

### Changed
- `ccbar demo` now frames the status line beneath a sample Claude Code prompt,
  so you can see how it actually appears in a session. The sample workspace
  shows `my-project`. The wizard's preview and the gallery are unaffected in
  behavior (the wizard preview stays a bare status line).

## [0.2.0] - 2026-07-22

### Added
- `ccbar gallery` — browse a set of curated presets (theme + bar style + width)
  rendered with sample data, then optionally apply one. Applying keeps your
  existing org label and segment toggles; only the theme and bar style change.
  Runs browse-only when piped or without a terminal. The wizard and all other
  commands are unchanged.

## [0.1.0] - 2026-07-22

Initial release.

### Added
- Two-line Claude Code status line: org/label badge, model name, effort level, workspace
  directory, and colored usage bars for the context window, 5-hour, and 7-day rate limits
  (each with a reset countdown).
- Threshold coloring for usage bars (green → yellow → red).
- `curl | bash` installer that installs to `~/.local/bin`, merges `statusLine` into
  `~/.claude/settings.json` (with a backup), and runs an interactive setup wizard.
- Interactive wizard (`ccbar config`) to configure the org label, which segments show,
  bar style and width, and color theme.
- Color themes: `default`, `mono`, `vivid`.
- Commands: `render`, `config`, `demo`, `uninstall`, `version`, `help`.
