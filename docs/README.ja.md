<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**[Claude Code](https://claude.com/claude-code) 向けの設定可能なステータスライン**<br>
モデル、努力レベル、ワークスペース、リアルタイムの使用状況をひと目で確認できます。

[![npm](https://img.shields.io/npm/v/ccbar-cli?color=cb3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/ccbar-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · **日本語** · [Français](README.fr.md) · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

`ccbar` は、Claude Code のプロンプトの下に、コンパクトな 2 行のステータスラインを表示します。

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **1 行目** — 任意の組織／ラベルのバッジ、モデル名、現在の努力レベル、ワークスペースのディレクトリ、そして（任意で）実行中の**セッションコスト**。
- **2 行目** — **コンテキストウィンドウ**、**5 時間**のレート制限、**7 日間**のレート制限を示す色付きの使用量バー。それぞれにリセットまでのカウントダウンが付きます。

バーは満ちるにつれて 🟢 緑 → 🟡 黄 → 🔴 赤 と変化するため、残りの余裕がどれくらいあるかをひと目で把握できます。

レート制限のウィンドウを管理するのに役立つ 2 つの追加機能があります。

- **アイドル状態の 5 時間ウィンドウ** — 最初のメッセージを送信するまで 5 時間ウィンドウは開始されないため、ccbar は `5h idle` と表示して、まだカウントが始まっていないことを知らせます。（Claude の 5 時間制限は最初のメッセージを起点とするローリングウィンドウです。アイドル中に使い捨ての短いプロンプトを送るとウィンドウが早く始まり、最終的な待ち時間が短くなります。）
- **バーンレート警告** *(オプトイン)* — 現在のペースがリセット*前*に制限を使い切る見込みのとき、ccbar はそのバーに `⚠ <time>` の推定を付加します。デフォルトではオフです。`ccbar config` で有効にできます。

ステータスラインに加えて、ccbar は 2 つのターミナルコマンドを提供します。拡張された使用状況パネルを表示する **[`ccbar stats`](#usage-insights)** と、7 日間の使用状況の推移を表示する **[`ccbar history`](#usage-insights)** です。

---

## インストール

```sh
npx ccbar-cli
```

または curl で:

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
| `CCBAR_SHOW_COST`   | `0`     | 1 行目に実行中のセッションコストを表示（`1`/`0`）。                 |
| `CCBAR_SHOW_BURN`   | `0`     | ペースが制限を早く使い切る場合に警告（`⚠ <time>`）（`1`/`0`）。 |
| `CCBAR_HISTORY`     | `1`     | `ccbar history` 用に使用量スナップショットを記録（`1`/`0`）。      |

すべての値に妥当なデフォルトがあるため、設定が欠けていたり不完全であっても問題なく表示されます。

### テーマ

| Theme     | Look                                   |
| --------- | -------------------------------------- |
| `default` | 控えめで抑えめの配色（推奨）    |
| `mono`    | グレースケールのみ — どんなプロンプトにもなじみます |
| `vivid`   | 明るくコントラストの高い配色           |

## コマンド

拡張された使用状況パネルを表示します（[使用状況インサイト](#usage-insights)を参照）。

```sh
ccbar stats
```

7 日間の使用状況の推移を表示します（[使用状況インサイト](#usage-insights)を参照）。

```sh
ccbar history
```

対話式のセットアップウィザードを実行します。

```sh
ccbar config
```

プリセットの見た目を一覧表示し、任意で 1 つを適用します。

```sh
ccbar gallery
```

サンプルデータでプレビューします — ステータスライン、または（`stats`／`history` を付けると）いずれかの使用状況パネルを表示します。

```sh
ccbar demo
ccbar demo stats
ccbar demo history
```

Claude Code のステータス JSON を標準入力から読み取り、バーを出力します （Claude Code 自身が呼び出すのはこのコマンドです）。

```sh
ccbar render
```

Claude Code の設定から ccbar の組み込みを削除します。

```sh
ccbar uninstall
```

バージョンを出力します。

```sh
ccbar version
```

ヘルプを表示します。

```sh
ccbar help
```

> `ccbar` コマンドは `~/.local/bin` に置かれます。そこが `PATH` に含まれていない場合は追加してください。
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
> ```
> ステータスライン自体は絶対パスを使うため、`PATH` に関係なく動作します。

<a id="usage-insights"></a>
## 使用状況インサイト

ccbar は**ネットワーク通信を一切行わず**、**認証情報も持ちません** — Claude Code が `ccbar render` に渡す JSON だけを参照します。そのデータをステータスライン以外でも活用できるように、`render` は最新のペイロードをキャッシュし（さらに小さなローリング履歴を記録し）、2 つのコマンドがそれを読み取ります。サンプルデータで試すには `ccbar demo stats` と `ccbar demo history` を実行してください。

### `ccbar stats`

オンデマンドの拡張使用状況パネル — モデル、セッション（5h）、週間（7d）、コンテキスト、コスト、リセットまでのカウントダウン、現在のペースを表示します。

```
ccbar — usage

  Model     Opus 4.8 (high)
  Session   ██████░░░░ 63%   resets in 2h 15m
            hits limit in ~1h 36m
  Weekly    ████████░░ 88%   resets in 3d 4h
  Context   ████░░░░░░ 42%   84k / 200k
  Cost      $0.42
  Updated   12s ago
```

これは Claude Code が `ccbar render` に渡した最新のペイロードを読み取ります（再描画のたびに取得され、どれくらい前のものかが記録されます）。新しい JSON をパイプで渡す（`… | ccbar stats`）と上書きできます。

### `ccbar history`

過去 7 日間の使用状況の推移 — 日ごとの 5 時間ピークのスパークライン、現在の週間使用量、日別テーブル（5h／7d のピーク %、推定コスト）、および実測のバーンレートを表示します。

```
ccbar — history (last 7 days)

  5h peak   ▃▆▇▄▅▅▅   now 63%
  7d        ████████░░ 86%

  Date      5h peak 7d peak     ~cost
  Jul 24        63%     86%     $2.64
  Jul 23        70%     85%     $3.44
  Jul 22        63%     84%     $3.46

  Burn (last hr)  ~22%/h → hits 5h limit in ~1h 40m
```

`render` はスロットリングされたスナップショット（最大で 1 分に 1 回）を `${XDG_STATE_HOME:-~/.local/state}/ccbar/history.tsv` に記録し、`history` がそれを要約します。これは Claude Code が開いていた時間のみを反映し、日別コストは推定値です（セッションごとに合計）。記録を完全に無効にするには `CCBAR_HISTORY=0` を設定してください。リセットするにはファイルを削除します。

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
