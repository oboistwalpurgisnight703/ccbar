# ccbar

**A configurable status line for [Claude Code](https://claude.com/claude-code)** — see your model, effort level, workspace, and live usage at a glance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Shell](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

`ccbar` renders a compact two-line status line under your Claude Code prompt:

```
Kobble [Opus 4.8 high -> my-project]
ctx ████░░░░░░ 42%   5h  ██████░░░░ 63% (resets 2h 15m)   7d  ████████░░ 88% (resets 3d 4h)
```

- **Line 1** — an optional org/label badge, the model name, the current effort level, and the workspace directory.
- **Line 2** — colored usage bars for your **context window**, **5-hour** rate limit, and **7-day** rate limit, each with a countdown to when it resets.

Bars turn 🟢 green → 🟡 yellow → 🔴 red as they fill, so you can see at a glance how much headroom you have left.

---

## Install

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

The installer will:

1. Install the `ccbar` script to `~/.local/bin/ccbar`.
2. Wire it into `~/.claude/settings.json` as your status line (backing up the file first).
3. Run an **interactive setup wizard** so you can pick your label, segments, theme, and bar style.

Then **start a new Claude Code session** (or restart it) to see your status line.

> Prefer not to pipe to `bash`? See [Manual install](#manual-install).

## Requirements

- **bash** (macOS's built-in 3.2 is fine) and coreutils `date`
- **[jq](https://jqlang.github.io/jq/)** — used to read Claude Code's status JSON and to safely edit your settings
  - macOS: `brew install jq`
  - Debian/Ubuntu: `sudo apt-get install jq`
  - Fedora: `sudo dnf install jq` · Arch: `sudo pacman -S jq` · Alpine: `sudo apk add jq`

## Configuration

Run the wizard anytime:

```sh
ccbar config
```

It writes a plain, hand-editable file at `~/.config/ccbar/config`:

| Key                 | Default | Description                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(empty)* | Label shown at the front (e.g. your company). Blank hides it.    |
| `CCBAR_THEME`       | `default` | Color theme: `default`, `mono`, or `vivid`.                      |
| `CCBAR_BAR_WIDTH`   | `10`    | Width of each usage bar, in cells.                                 |
| `CCBAR_BAR_FILLED`  | `█`     | Character for the filled portion of a bar.                         |
| `CCBAR_BAR_EMPTY`   | `░`     | Character for the empty portion of a bar.                          |
| `CCBAR_SHOW_EFFORT` | `1`     | Show the effort level (`1`/`0`).                                   |
| `CCBAR_SHOW_CTX`    | `1`     | Show the context-window bar (`1`/`0`).                             |
| `CCBAR_SHOW_5H`     | `1`     | Show the 5-hour usage bar (`1`/`0`).                               |
| `CCBAR_SHOW_7D`     | `1`     | Show the 7-day usage bar (`1`/`0`).                                |

Every value has a sensible default, so a missing or partial config still renders fine.

### Themes

| Theme     | Look                                   |
| --------- | -------------------------------------- |
| `default` | Subtle, dimmed colors (recommended)    |
| `mono`    | Grayscale only — blends into any prompt |
| `vivid`   | Bright, high-contrast colors           |

## Commands

```
ccbar config       Run the interactive setup wizard.
ccbar demo         Preview the status line with sample data.
ccbar render       Read Claude Code's status JSON on stdin and print the bar
                   (this is what Claude Code itself calls).
ccbar uninstall    Remove ccbar's wiring from Claude Code settings.
ccbar version      Print the version.
ccbar help         Show help.
```

> The `ccbar` command lives in `~/.local/bin`. If that's not on your `PATH`, add it:
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
> ```
> The status line itself uses an absolute path, so it works regardless of your `PATH`.

## How it works

Claude Code supports [custom status lines](https://docs.claude.com/en/docs/claude-code/statusline): it runs a command and pipes a JSON object (model, workspace, context window, rate limits) to its stdin, then displays whatever the command prints. `ccbar` reads that JSON with `jq` and renders the two-line bar.

The installer adds this to `~/.claude/settings.json` (merging, never clobbering your other settings):

```json
{
  "statusLine": {
    "type": "command",
    "command": "/Users/you/.local/bin/ccbar render",
    "padding": 0
  }
}
```

## Manual install

```sh
# 1. Download the script
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. Configure it
~/.local/bin/ccbar config

# 3. Point Claude Code at it (add to ~/.claude/settings.json)
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## Uninstall

```sh
ccbar uninstall
```

Removes the `statusLine` entry from `~/.claude/settings.json` (with a `.bak` backup) and optionally deletes the binary and config.

## Troubleshooting

- **Status line doesn't appear** — start a *new* Claude Code session; the status line loads at session start.
- **`jq not found`** — install `jq` (see [Requirements](#requirements)).
- **Broken characters in the bars** — your terminal font may lack block glyphs; run `ccbar config` and pick the `=-` ascii bar style.

## Contributing

Issues and PRs welcome. `ccbar` is a single portable bash script (`bin/ccbar`) with no build step — edit it, then run `bin/ccbar demo` to preview.

## License

[MIT](./LICENSE) © Lakpriya Senevirathna
