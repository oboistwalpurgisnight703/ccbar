# Changelog

All notable changes to this project are documented here. This project adheres to
[Semantic Versioning](https://semver.org/).

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
