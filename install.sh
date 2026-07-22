#!/usr/bin/env bash
#
# ccbar installer.
#
#   curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
#
# What it does:
#   1. Checks dependencies (bash, jq, curl).
#   2. Installs the `ccbar` script to ~/.local/bin/ccbar.
#   3. Wires it into ~/.claude/settings.json as the status line (backing up first).
#   4. Runs the interactive setup wizard.
#
# For local testing before publishing, set CCBAR_SRC to a local copy of bin/ccbar:
#   CCBAR_SRC=./bin/ccbar bash install.sh
#
set -eu

REPO="lakpriya1s/ccbar"
REF="${CCBAR_REF:-main}"
RAW_BASE="https://raw.githubusercontent.com/${REPO}/${REF}"

BIN_DIR="$HOME/.local/bin"
BIN="$BIN_DIR/ccbar"
SETTINGS_DIR="$HOME/.claude"
SETTINGS="$SETTINGS_DIR/settings.json"

# ---- pretty output ----------------------------------------------------------
if [ -t 1 ]; then
  B='\033[1m'; DIM='\033[2m'; GRN='\033[0;32m'; RED='\033[0;31m'; YEL='\033[0;33m'; R='\033[0m'
else
  B=''; DIM=''; GRN=''; RED=''; YEL=''; R=''
fi
say()  { printf "%b\n" "$1"; }
ok()   { printf "%b\n" "${GRN}✓${R} $1"; }
warn() { printf "%b\n" "${YEL}!${R} $1"; }
die()  { printf "%b\n" "${RED}✗${R} $1" >&2; exit 1; }

say "${B}ccbar installer${R}"
say ""

# ---- 1. dependencies --------------------------------------------------------
have() { command -v "$1" >/dev/null 2>&1; }

if ! have jq; then
  say "${RED}jq is required but not installed.${R}"
  case "$(uname -s)" in
    Darwin) say "  Install it with:  ${B}brew install jq${R}" ;;
    Linux)
      if have apt-get;   then say "  Install it with:  ${B}sudo apt-get install jq${R}"
      elif have dnf;     then say "  Install it with:  ${B}sudo dnf install jq${R}"
      elif have pacman;  then say "  Install it with:  ${B}sudo pacman -S jq${R}"
      elif have apk;     then say "  Install it with:  ${B}sudo apk add jq${R}"
      else say "  Install jq via your package manager, then re-run this installer."; fi
      ;;
    *) say "  Install jq via your package manager, then re-run this installer." ;;
  esac
  die "missing dependency: jq"
fi

if [ -z "${CCBAR_SRC:-}" ] && ! have curl; then
  die "curl is required to download ccbar"
fi
ok "dependencies present (jq)"

# ---- 2. install the script --------------------------------------------------
mkdir -p "$BIN_DIR"
if [ -n "${CCBAR_SRC:-}" ]; then
  cp "$CCBAR_SRC" "$BIN"
else
  curl -fsSL "$RAW_BASE/bin/ccbar" -o "$BIN" || die "failed to download ccbar from $RAW_BASE/bin/ccbar"
fi
chmod +x "$BIN"
ok "installed ${B}$BIN${R}"

# ---- 3. wire into Claude Code settings --------------------------------------
mkdir -p "$SETTINGS_DIR"
if [ ! -f "$SETTINGS" ]; then
  printf '{}\n' > "$SETTINGS"
fi

# Refuse to touch a settings file that isn't valid JSON.
if ! jq empty "$SETTINGS" >/dev/null 2>&1; then
  die "$SETTINGS is not valid JSON — leaving it untouched. Fix it and re-run."
fi

cp "$SETTINGS" "${SETTINGS}.bak"
tmp="${SETTINGS}.ccbar.tmp"
jq --arg cmd "$BIN render" \
   '.statusLine = {type: "command", command: $cmd, padding: 0}' \
   "$SETTINGS" > "$tmp" && mv "$tmp" "$SETTINGS"
ok "configured status line in ${B}$SETTINGS${R} ${DIM}(backup: ${SETTINGS}.bak)${R}"

# ---- 4. run the setup wizard ------------------------------------------------
say ""
if [ -e /dev/tty ]; then
  "$BIN" config || warn "setup wizard skipped — run '${B}ccbar config${R}' anytime to configure"
else
  warn "no terminal detected — run '${B}ccbar config${R}' to customize"
fi

# ---- done -------------------------------------------------------------------
say ""
ok "${B}ccbar installed.${R}"
say ""
say "Preview:"
"$BIN" demo || true
say ""
say "Start a new Claude Code session (or restart it) to see your status line."

# PATH hint for the `ccbar` command itself (the status line uses an absolute path).
case ":$PATH:" in
  *":$BIN_DIR:"*) : ;;
  *) say ""
     say "${DIM}Tip: add ~/.local/bin to your PATH to use the 'ccbar' command directly:${R}"
     say "${DIM}  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.zshrc${R}" ;;
esac
