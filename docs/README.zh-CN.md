<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**为 [Claude Code](https://claude.com/claude-code) 打造的可配置状态栏**<br>
一眼掌握你的模型、投入级别、工作区以及实时用量。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · **简体中文** · [Español](README.es.md) · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

`ccbar` 会在你的 Claude Code 提示符下方渲染一个紧凑的两行状态栏：

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **第 1 行** — 可选的组织/标签徽标、模型名称、当前投入级别，以及工作区目录。
- **第 2 行** — 分别针对你的**上下文窗口**、**5 小时**速率限制和**7 天**速率限制的彩色用量条，每条都带有距离重置的倒计时。

用量条会随着填充程度由 🟢 绿 → 🟡 黄 → 🔴 红 变化，让你一眼就能看出还剩下多少余量。

---

## 安装

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

安装程序会：

1. 将 `ccbar` 脚本安装到 `~/.local/bin/ccbar`。
2. 将其接入 `~/.claude/settings.json` 作为你的状态栏（会先备份该文件）。
3. 运行一个**交互式设置向导**，让你选择标签、分段、主题和用量条样式。

然后**启动一个新的 Claude Code 会话**（或重启它）即可看到你的状态栏。

> 不想把内容通过管道传给 `bash`？请参阅[手动安装](#manual-install)。

<a id="requirements"></a>
## Requirements

- **bash**（macOS 内置的 3.2 即可）以及 coreutils 的 `date`
- **[jq](https://jqlang.github.io/jq/)** — 用于读取 Claude Code 的状态 JSON，并安全地编辑你的设置
  - macOS：`brew install jq`
  - Debian/Ubuntu：`sudo apt-get install jq`
  - Fedora：`sudo dnf install jq` · Arch：`sudo pacman -S jq` · Alpine：`sudo apk add jq`

## 配置

随时运行向导：

```sh
ccbar config
```

它会在 `~/.config/ccbar/config` 写入一个可手动编辑的纯文本文件：

| Key                 | Default | Description                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(空)* | 显示在最前面的标签（例如你的公司）。留空则隐藏。    |
| `CCBAR_THEME`       | `default` | 颜色主题：`default`、`mono` 或 `vivid`。                      |
| `CCBAR_BAR_WIDTH`   | `10`    | 每个用量条的宽度，以字符格为单位。                                 |
| `CCBAR_BAR_FILLED`  | `█`     | 用量条已填充部分所用的字符。                         |
| `CCBAR_BAR_EMPTY`   | `░`     | 用量条空白部分所用的字符。                          |
| `CCBAR_SHOW_EFFORT` | `1`     | 显示投入级别（`1`/`0`）。                                   |
| `CCBAR_SHOW_CTX`    | `1`     | 显示上下文窗口用量条（`1`/`0`）。                             |
| `CCBAR_SHOW_5H`     | `1`     | 显示 5 小时用量条（`1`/`0`）。                              |
| `CCBAR_SHOW_7D`     | `1`     | 显示 7 天用量条（`1`/`0`）。                               |

每个值都有合理的默认设置，因此即使配置缺失或不完整，状态栏依然能正常渲染。

### 主题

| Theme     | Look                                   |
| --------- | -------------------------------------- |
| `default` | 柔和、暗淡的配色（推荐）    |
| `mono`    | 仅灰度 — 可融入任何提示符 |
| `vivid`   | 明亮、高对比度的配色           |

## 命令

运行交互式设置向导。

```sh
ccbar config
```

浏览预设外观，并可选择应用其中一个。

```sh
ccbar gallery
```

用示例数据预览状态栏。

```sh
ccbar demo
```

从标准输入读取 Claude Code 的状态 JSON 并打印状态栏 （这正是 Claude Code 本身所调用的命令）。

```sh
ccbar render
```

从 Claude Code 设置中移除 ccbar 的接入。

```sh
ccbar uninstall
```

打印版本号。

```sh
ccbar version
```

显示帮助。

```sh
ccbar help
```

> `ccbar` 命令位于 `~/.local/bin`。如果该目录不在你的 `PATH` 中，请将其添加进去：
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # 或 ~/.bashrc
> ```
> 状态栏本身使用的是绝对路径，因此无论你的 `PATH` 如何设置都能正常工作。

## 工作原理

Claude Code 支持[自定义状态栏](https://docs.claude.com/en/docs/claude-code/statusline)：它会运行一条命令，并把一个 JSON 对象（模型、工作区、上下文窗口、速率限制）通过管道传入该命令的标准输入，然后显示该命令所打印的任何内容。`ccbar` 用 `jq` 读取该 JSON，并渲染出两行状态栏。

安装程序会将以下内容添加到 `~/.claude/settings.json`（采用合并方式，绝不覆盖你的其他设置）：

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
## 手动安装

```sh
# 1. 下载脚本
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. 进行配置
~/.local/bin/ccbar config

# 3. 让 Claude Code 指向它（添加到 ~/.claude/settings.json）
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## 卸载

```sh
ccbar uninstall
```

它会从 `~/.claude/settings.json` 中移除 `statusLine` 条目（并生成一个 `.bak` 备份），并可选择删除二进制文件和配置。

## 故障排查

- **状态栏不显示** — 请启动一个*新的* Claude Code 会话；状态栏在会话启动时加载。
- **`jq not found`** — 请安装 `jq`（参见 [Requirements](#requirements)）。
- **用量条中出现乱码字符** — 你的终端字体可能缺少块状字形；运行 `ccbar config` 并选择 `=-` 这种 ascii 用量条样式。

## 贡献

欢迎提交 Issue 和 PR。`ccbar` 是一个单一、可移植的 bash 脚本（`bin/ccbar`），无需构建步骤 — 编辑它，然后运行 `bin/ccbar demo` 即可预览。

## 许可证

[MIT](../LICENSE) © Lakpriya Senevirathna
