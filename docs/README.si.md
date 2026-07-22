<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**[Claude Code](https://claude.com/claude-code) සඳහා වින්‍යාස කළ හැකි තත්ත්ව රේඛාවක්**<br>
ඔබේ මාදිලිය, effort මට්ටම, workspace, සහ සජීවී භාවිතය එකවර දැක ගන්න.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [한국어](README.ko.md) · **සිංහල**

</div>

---

`ccbar` මඟින් ඔබේ Claude Code prompt එක යටින් සංයුක්ත, පේළි දෙකකින් යුත් තත්ත්ව රේඛාවක් නිරූපණය කරයි:

```
Kobble [Opus 4.8 high -> my-project]
ctx ████░░░░░░ 42%   5h  ██████░░░░ 63% (resets 2h 15m)   7d  ████████░░ 88% (resets 3d 4h)
```

- **පේළි 1** — විකල්ප org/label ලාංඡනයක්, මාදිලියේ නම, වර්තමාන effort මට්ටම, සහ workspace නාමාවලිය.
- **පේළි 2** — ඔබේ **context window** එක, **පැය 5** rate සීමාව, සහ **දින 7** rate සීමාව සඳහා වර්ණවත් භාවිත තීරු, ඒ එක් එකක් නැවත සැකසෙන (reset) වන අවස්ථාව දක්වා ගණන් කිරීමක් සමඟින්.

තීරු පිරෙන විට 🟢 කොළ → 🟡 කහ → 🔴 රතු ලෙස වෙනස් වේ, එවිට ඔබට ඉතිරිව ඇති ඉඩ කොපමණදැයි එකවර දැක ගත හැක.

---

## ස්ථාපනය

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

ස්ථාපකය මඟින්:

1. `ccbar` script එක `~/.local/bin/ccbar` වෙත ස්ථාපනය කරයි.
2. එය ඔබේ තත්ත්ව රේඛාව ලෙස `~/.claude/settings.json` වෙත සම්බන්ධ කරයි (පළමුව ගොනුව උපස්ථ කරමින්).
3. **අන්තර්ක්‍රියාකාරී පිහිටුවීමේ wizard** එකක් ධාවනය කරයි, එවිට ඔබට ඔබේ label, කොටස්, තේමාව, සහ තීරු විලාසය තෝරා ගත හැක.

ඉන්පසු ඔබේ තත්ත්ව රේඛාව දැකීමට **නව Claude Code සැසියක් ආරම්භ කරන්න** (හෝ එය නැවත ආරම්භ කරන්න).

> `bash` වෙත pipe කිරීමට කැමති නැද්ද? [Manual install](#manual-install) බලන්න.

<a id="requirements"></a>
## අවශ්‍යතා

- **bash** (macOS හි ඇතුළත් 3.2 ප්‍රමාණවත්) සහ coreutils `date`
- **[jq](https://jqlang.github.io/jq/)** — Claude Code හි තත්ත්ව JSON කියවීමට සහ ඔබේ settings ආරක්ෂිතව සංස්කරණය කිරීමට භාවිතා වේ
  - macOS: `brew install jq`
  - Debian/Ubuntu: `sudo apt-get install jq`
  - Fedora: `sudo dnf install jq` · Arch: `sudo pacman -S jq` · Alpine: `sudo apk add jq`

## වින්‍යාසය

ඕනෑම විටෙක wizard එක ධාවනය කරන්න:

```sh
ccbar config
```

එය `~/.config/ccbar/config` හිදී සරල, අතින් සංස්කරණය කළ හැකි ගොනුවක් ලියයි:

| Key                 | Default | විස්තරය                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(හිස්)* | ඉදිරිපස පෙන්වන label එක (උදා. ඔබේ සමාගම). හිස් නම් එය සඟවයි.    |
| `CCBAR_THEME`       | `default` | වර්ණ තේමාව: `default`, `mono`, හෝ `vivid`.                      |
| `CCBAR_BAR_WIDTH`   | `10`    | එක් එක් භාවිත තීරුවේ පළල, කොටු වලින්.                                 |
| `CCBAR_BAR_FILLED`  | `█`     | තීරුවේ පිරුණු කොටස සඳහා අකුර.                         |
| `CCBAR_BAR_EMPTY`   | `░`     | තීරුවේ හිස් කොටස සඳහා අකුර.                          |
| `CCBAR_SHOW_EFFORT` | `1`     | effort මට්ටම පෙන්වන්න (`1`/`0`).                                   |
| `CCBAR_SHOW_CTX`    | `1`     | context-window තීරුව පෙන්වන්න (`1`/`0`).                             |
| `CCBAR_SHOW_5H`     | `1`     | පැය 5 භාවිත තීරුව පෙන්වන්න (`1`/`0`).                              |
| `CCBAR_SHOW_7D`     | `1`     | දින 7 භාවිත තීරුව පෙන්වන්න (`1`/`0`).                               |

සෑම අගයකටම සුදුසු default එකක් ඇත, එබැවින් නැති හෝ අර්ධ වින්‍යාසයක් වුවත් හොඳින් නිරූපණය වේ.

### තේමා

| Theme     | පෙනුම                                   |
| --------- | -------------------------------------- |
| `default` | සියුම්, අඳුරු වර්ණ (නිර්දේශිත)    |
| `mono`    | අළු පරිමාණය පමණි — ඕනෑම prompt එකකට ගැලපේ |
| `vivid`   | දීප්තිමත්, ඉහළ-විරෝධතා වර්ණ           |

## විධාන

```
ccbar config       අන්තර්ක්‍රියාකාරී පිහිටුවීමේ wizard එක ධාවනය කරන්න.
ccbar demo         නියැදි දත්ත සමඟ තත්ත්ව රේඛාව පෙරදසුන් කරන්න.
ccbar render       stdin මත Claude Code හි තත්ත්ව JSON කියවා තීරුව මුද්‍රණය කරන්න
                   (මෙය Claude Code විසින්ම කැඳවන දෙයයි).
ccbar uninstall    Claude Code settings වෙතින් ccbar හි සම්බන්ධතාවය ඉවත් කරන්න.
ccbar version      අනුවාදය මුද්‍රණය කරන්න.
ccbar help         උදව් පෙන්වන්න.
```

> `ccbar` විධානය `~/.local/bin` හි පවතී. එය ඔබේ `PATH` හි නොමැති නම්, එය එක් කරන්න:
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
> ```
> තත්ත්ව රේඛාවම නිරපේක්ෂ මාර්ගයක් භාවිතා කරයි, එබැවින් එය ඔබේ `PATH` කුමක් වුවත් ක්‍රියා කරයි.

## එය ක්‍රියා කරන ආකාරය

Claude Code මඟින් [custom status lines](https://docs.claude.com/en/docs/claude-code/statusline) සඳහා සහාය දක්වයි: එය විධානයක් ධාවනය කර JSON වස්තුවක් (මාදිලිය, workspace, context window, rate සීමා) එහි stdin වෙත pipe කරයි, ඉන්පසු විධානය මුද්‍රණය කරන ඕනෑම දෙයක් පෙන්වයි. `ccbar` එම JSON `jq` සමඟින් කියවා පේළි දෙකේ තීරුව නිරූපණය කරයි.

ස්ථාපකය මෙය `~/.claude/settings.json` වෙත එක් කරයි (ඔබේ අනෙකුත් settings කිසිවිටෙක මකා නොදමා, ඒකාබද්ධ කරමින්):

```json
{
  "statusLine": {
    "type": "command",
    "command": "/Users/you/.local/bin/ccbar render",
    "padding": 0
  }
}
```

<a id="manual-install"></a>
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

## අස්ථාපනය

```sh
ccbar uninstall
```

`~/.claude/settings.json` වෙතින් `statusLine` ඇතුළත්කිරීම ඉවත් කරයි (`.bak` උපස්ථයක් සමඟින්) සහ විකල්පමය ලෙස binary එක සහ config එක මකා දමයි.

## දෝෂ නිරාකරණය

- **තත්ත්ව රේඛාව නොපෙනේ** — *නව* Claude Code සැසියක් ආරම්භ කරන්න; තත්ත්ව රේඛාව සැසිය ආරම්භයේදී පූරණය වේ.
- **`jq not found`** — `jq` ස්ථාපනය කරන්න ([Requirements](#requirements) බලන්න).
- **තීරු වල කැඩුණු අකුරු** — ඔබේ terminal font එකෙහි block glyphs නොතිබිය හැක; `ccbar config` ධාවනය කර `=-` ascii තීරු විලාසය තෝරන්න.

## දායක වීම

Issues සහ PRs පිළිගනිමු. `ccbar` යනු build පියවරක් නොමැති තනි ගෙනයා හැකි bash script එකකි (`bin/ccbar`) — එය සංස්කරණය කරන්න, ඉන්පසු පෙරදසුන් කිරීමට `bin/ccbar demo` ධාවනය කරන්න.

## බලපත්‍රය

[MIT](../LICENSE) © Lakpriya Senevirathna
