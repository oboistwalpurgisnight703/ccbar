#!/usr/bin/env node
'use strict';

// npx entry point for ccbar.
//
//   npx ccbar            Install ccbar and run the setup wizard.
//   npx ccbar config     Re-run the wizard.
//   npx ccbar gallery    Browse preset looks.
//   npx ccbar demo       Preview the status line.
//   npx ccbar uninstall  Remove ccbar.
//
// This is a thin wrapper around the bundled bash script (bin/ccbar): it copies
// that script to ~/.local/bin, wires it into ~/.claude/settings.json, and then
// forwards commands to it.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOME = os.homedir();
const BIN_DIR = path.join(HOME, '.local', 'bin');
const BIN = path.join(BIN_DIR, 'ccbar');
const SETTINGS_DIR = path.join(HOME, '.claude');
const SETTINGS = path.join(SETTINGS_DIR, 'settings.json');
const BUNDLED = path.join(__dirname, 'bin', 'ccbar');

const FORWARD = ['render', 'stats', 'status', 'history', 'hist', 'config', 'gallery', 'presets', 'demo', 'uninstall', 'version', 'help'];

// ---- tiny ANSI helpers (disabled when not a TTY) ----------------------------
const tty = process.stdout.isTTY;
const c = (code, s) => (tty ? `[${code}m${s}[0m` : s);
const b = (s) => c('1', s);
const dim = (s) => c('2', s);
const grn = (s) => c('32', s);
const red = (s) => c('31', s);
const yel = (s) => c('33', s);
const ok = (s) => console.log(`${grn('✓')} ${s}`);
const warn = (s) => console.log(`${yel('!')} ${s}`);
const die = (s) => { console.error(`${red('✗')} ${s}`); process.exit(1); };

function have(cmd) {
  const r = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
  return !r.error && r.status === 0;
}

function jqHint() {
  const plat = process.platform;
  if (plat === 'darwin') return 'brew install jq';
  // linux — best-effort guess
  if (have2('apt-get')) return 'sudo apt-get install jq';
  if (have2('dnf')) return 'sudo dnf install jq';
  if (have2('pacman')) return 'sudo pacman -S jq';
  if (have2('apk')) return 'sudo apk add jq';
  return 'install jq via your package manager';
}
function have2(cmd) {
  const r = spawnSync('sh', ['-c', `command -v ${cmd}`], { stdio: 'ignore' });
  return r.status === 0;
}

function installScript() {
  fs.mkdirSync(BIN_DIR, { recursive: true });
  fs.copyFileSync(BUNDLED, BIN);
  fs.chmodSync(BIN, 0o755);
  ok(`installed ${b(BIN)}`);
}

function wireSettings() {
  fs.mkdirSync(SETTINGS_DIR, { recursive: true });
  let obj = {};
  if (fs.existsSync(SETTINGS)) {
    const raw = fs.readFileSync(SETTINGS, 'utf8');
    if (raw.trim() !== '') {
      try {
        obj = JSON.parse(raw);
      } catch (e) {
        die(`${SETTINGS} is not valid JSON — leaving it untouched. Fix it and re-run.`);
      }
    }
    fs.copyFileSync(SETTINGS, SETTINGS + '.bak');
  }
  obj.statusLine = { type: 'command', command: `${BIN} render`, padding: 0 };
  fs.writeFileSync(SETTINGS, JSON.stringify(obj, null, 2) + '\n');
  const suffix = fs.existsSync(SETTINGS + '.bak') ? ` ${dim(`(backup: ${SETTINGS}.bak)`)}` : '';
  ok(`configured status line in ${b(SETTINGS)}${suffix}`);
}

function runInstall() {
  console.log(b('ccbar installer') + '\n');

  if (!fs.existsSync(BUNDLED)) die(`bundled ccbar script missing at ${BUNDLED}`);

  if (!have('jq')) {
    warn(`${b('jq')} is not installed — ccbar needs it to render. Install it with: ${b(jqHint())}`);
  } else {
    ok('dependencies present (jq)');
  }

  installScript();
  wireSettings();

  // Run the interactive wizard (bash reads from /dev/tty; skips gracefully if none).
  console.log('');
  spawnSync(BIN, ['config'], { stdio: 'inherit' });

  console.log('');
  ok(b('ccbar installed.'));
  console.log('\nPreview:');
  spawnSync(BIN, ['demo'], { stdio: 'inherit' });
  console.log('\nStart a new Claude Code session (or restart it) to see your status line.');

  if (!(process.env.PATH || '').split(path.delimiter).includes(BIN_DIR)) {
    console.log('');
    console.log(dim('Tip: add ~/.local/bin to your PATH to use the `ccbar` command directly:'));
    console.log(dim(`  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc`));
  }
}

function forward(args) {
  // Hand off to the ccbar script without side effects: prefer the installed
  // copy if present, otherwise run the bundled one. (Only `npx ccbar` with no
  // command installs and wires up the status line.)
  const target = fs.existsSync(BIN) ? BIN : BUNDLED;
  const r = spawnSync(target, args, { stdio: 'inherit' });
  process.exit(r.status === null ? 1 : r.status);
}

function main() {
  if (process.platform === 'win32') {
    die('ccbar is a bash tool for macOS/Linux and does not support Windows.');
  }
  const args = process.argv.slice(2);
  const cmd = args[0];
  if (!cmd || cmd === 'install') {
    runInstall();
  } else if (FORWARD.includes(cmd)) {
    forward(args);
  } else {
    console.error(`ccbar: unknown command '${cmd}'`);
    forward(['help']);
  }
}

main();
