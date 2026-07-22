<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**[Claude Code](https://claude.com/claude-code) 向けの設定可能なステータスライン**<br>
モデル、努力レベル、ワークスペース、リアルタイムの使用状況をひと目で確認できます。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · **日本語** · [Français](README.fr.md) · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

`ccbar` は、Claude Code のプロンプトの下に、コンパクトな 2 行のステータスラインを表示します。

```
Acme [Opus 4.8 high -> my-project]
ctx ████░░░░░░ 42%   5h  ██████░░░░ 63% (resets 2h 15m)   7d  ████████░░ 88% (resets 3d 4h)
```

- **1 行目** — 任意の組織／ラベルのバッジ、モデル名、現在の努力レベル、ワークスペースのディレクトリ。
- **2 行目** — **コンテキストウィンドウ**、**5 時間**のレート制限、**7 日間**のレート制限を示す色付きの使用量バー。それぞれにリセットまでのカウントダウンが付きます。

バーは満ちるにつれて 🟢 緑 → 🟡 黄 → 🔴 赤 と変化するため、残りの余裕がどれくらいあるかをひと目で把握できます。

---

## インストール

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

インストーラーは次の処理を行います。

1. `ccbar` スクリプトを `~/.local/bin/ccbar` にインストールします。
2. ステータスラインとして `~/.claude/settings.json` に組み込みます（先にファイルをバックアップします）。
3. **対話式のセットアップウィザード**を実行し、ラベル、セグメント、テーマ、バーのスタイルを選べるようにします。

その後、ステータスラインを表示するには **Claude Code のセッションを新しく開始**（または再起動）してください。

> `bash` へのパイプを避けたいですか？ [手動インストール](#manual-install)をご覧ください。

<a id="requirements"></a>
## 動作要件

- **bash**（macOS 内蔵の 3.2 で問題ありません）と coreutils の `date`
- **[jq](https://jqlang.github.io/jq/)** — Claude Code のステータス JSON の読み取りと、設定ファイルの安全な編集に使用します
  - macOS: `brew install jq`
  - Debian/Ubuntu: `sudo apt-get install jq`
  - Fedora: `sudo dnf install jq` · Arch: `sudo pacman -S jq` · Alpine: `sudo apk add jq`

## 設定

ウィザードはいつでも実行できます。

```sh
ccbar config
```

これにより、手で編集できるプレーンなファイルが `~/.config/ccbar/config` に書き込まれます。

| Key                 | Default | Description                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(空)* | 先頭に表示されるラベル（例: 会社名）。空にすると非表示になります。    |
| `CCBAR_THEME`       | `default` | カラーテーマ: `default`、`mono`、`vivid`。                      |
| `CCBAR_BAR_WIDTH`   | `10`    | 各使用量バーの幅（セル単位）。                                 |
| `CCBAR_BAR_FILLED`  | `█`     | バーの満ちた部分に使う文字。                         |
| `CCBAR_BAR_EMPTY`   | `░`     | バーの空いた部分に使う文字。                          |
| `CCBAR_SHOW_EFFORT` | `1`     | 努力レベルを表示（`1`/`0`）。                                   |
| `CCBAR_SHOW_CTX`    | `1`     | コンテキストウィンドウのバーを表示（`1`/`0`）。                             |
| `CCBAR_SHOW_5H`     | `1`     | 5 時間の使用量バーを表示（`1`/`0`）。                              |
| `CCBAR_SHOW_7D`     | `1`     | 7 日間の使用量バーを表示（`1`/`0`）。                               |

すべての値に妥当なデフォルトがあるため、設定が欠けていたり不完全であっても問題なく表示されます。

### テーマ

| Theme     | Look                                   |
| --------- | -------------------------------------- |
| `default` | 控えめで抑えめの配色（推奨）    |
| `mono`    | グレースケールのみ — どんなプロンプトにもなじみます |
| `vivid`   | 明るくコントラストの高い配色           |

## コマンド

```
ccbar config       対話式のセットアップウィザードを実行します。
ccbar gallery      プリセットの見た目を一覧表示し、任意で 1 つを適用します。
ccbar demo         サンプルデータでステータスラインをプレビューします。
ccbar render       Claude Code のステータス JSON を標準入力から読み取り、バーを出力します
                   （Claude Code 自身が呼び出すのはこのコマンドです）。
ccbar uninstall    Claude Code の設定から ccbar の組み込みを削除します。
ccbar version      バージョンを出力します。
ccbar help         ヘルプを表示します。
```

### ギャラリー

どの見た目にするか迷っていますか？ 厳選したプリセット集（それぞれテーマ、バーのスタイル、幅の組み合わせ）を一覧で確認し、キー操作 1 つで適用できます。

```sh
ccbar gallery
```

各プリセットをサンプルデータで描画して表示し、その後（ターミナルでは）どれを適用するか尋ねます。プリセットを適用すると変更されるのはテーマとバーのスタイルだけで、組織ラベルとセグメントの表示切り替えはそのまま保たれます。プロンプトなしで一覧を眺めたいだけなら、パイプで実行してください（例: `ccbar gallery | less`）。

> `ccbar` コマンドは `~/.local/bin` に置かれます。そこが `PATH` に含まれていない場合は追加してください。
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
> ```
> ステータスライン自体は絶対パスを使うため、`PATH` に関係なく動作します。

## 仕組み

Claude Code は[カスタムステータスライン](https://docs.claude.com/en/docs/claude-code/statusline)をサポートしています。コマンドを実行し、その標準入力に JSON オブジェクト（モデル、ワークスペース、コンテキストウィンドウ、レート制限）をパイプで渡したうえで、コマンドが出力した内容をそのまま表示します。`ccbar` はその JSON を `jq` で読み取り、2 行のバーを描画します。

インストーラーは以下を `~/.claude/settings.json` に追加します（マージのみを行い、他の設定を上書きすることはありません）。

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
## 手動インストール

```sh
# 1. スクリプトをダウンロードする
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. 設定する
~/.local/bin/ccbar config

# 3. Claude Code から参照させる（~/.claude/settings.json に追加）
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## アンインストール

```sh
ccbar uninstall
```

`~/.claude/settings.json` から `statusLine` エントリを削除し（`.bak` バックアップを作成します）、必要に応じてバイナリと設定も削除します。

## トラブルシューティング

- **ステータスラインが表示されない** — Claude Code のセッションを*新しく*開始してください。ステータスラインはセッション開始時に読み込まれます。
- **`jq not found`** — `jq` をインストールしてください（[動作要件](#requirements)を参照）。
- **バーの文字化け** — お使いのターミナルフォントにブロックグリフが含まれていない可能性があります。`ccbar config` を実行し、`=-` の ASCII バースタイルを選んでください。

## コントリビュート

Issue や PR を歓迎します。`ccbar` はビルド手順のない単一のポータブルな bash スクリプト（`bin/ccbar`）です。編集したら `bin/ccbar demo` を実行してプレビューできます。

## ライセンス

[MIT](../LICENSE) © Lakpriya Senevirathna
