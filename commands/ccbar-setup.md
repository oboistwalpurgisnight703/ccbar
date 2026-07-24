---
description: Install ccbar and wire it into your Claude Code status line
allowed-tools: Bash(bash:*), Bash(ccbar:*)
---

Set up the **ccbar** status line for the user.

Run the bundled installer below. It copies the `ccbar` script to `~/.local/bin/ccbar`
and wires it into `~/.claude/settings.json` as the status line — merging with any
existing settings and writing a `.bak` backup first:

!`bash "${CLAUDE_PLUGIN_ROOT}/bin/ccbar" install`

Then tell the user:

- Run `ccbar config` in a terminal to customize the look (theme, segments, bar
  style, and optional session-cost / burn-rate display).
- **Start a new Claude Code session** (or restart) for the status line to appear.

Do not modify any files other than what the installer touches.
