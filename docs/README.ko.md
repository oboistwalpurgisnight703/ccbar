<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**[Claude Code](https://claude.com/claude-code)를 위한 설정 가능한 상태 표시줄**<br>
모델, 노력 수준, 워크스페이스, 실시간 사용량을 한눈에 확인하세요.

[![npm](https://img.shields.io/npm/v/ccbar-cli?color=cb3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/ccbar-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · [日本語](README.ja.md) · [Français](README.fr.md) · **한국어** · [සිංහල](README.si.md)

</div>

---

`ccbar`는 Claude Code 프롬프트 아래에 간결한 두 줄짜리 상태 표시줄을 렌더링합니다:

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **1번째 줄** — 선택적인 조직/레이블 배지, 모델 이름, 현재 노력 수준, 그리고 워크스페이스 디렉터리.
- **2번째 줄** — **컨텍스트 창**, **5시간** 사용 한도, **7일** 사용 한도에 대한 색상 사용량 막대이며, 각각 재설정까지 남은 시간을 함께 표시합니다.

막대는 채워질수록 🟢 초록 → 🟡 노랑 → 🔴 빨강으로 바뀌므로, 남은 여유가 얼마나 되는지 한눈에 알 수 있습니다.

---

## 설치

```sh
npx ccbar-cli
```

또는 curl로:

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

설치 프로그램이 하는 일:

1. `ccbar` 스크립트를 `~/.local/bin/ccbar`에 설치합니다.
2. `~/.claude/settings.json`에 상태 표시줄로 연결합니다(먼저 파일을 백업합니다).
3. **대화형 설정 마법사**를 실행하여 레이블, 세그먼트, 테마, 막대 스타일을 선택할 수 있게 합니다.

그런 다음 상태 표시줄을 보려면 **새 Claude Code 세션을 시작**하거나 재시작하세요.

> `bash`로 파이프하는 방식이 내키지 않나요? [수동 설치](#manual-install)를 참고하세요.

<a id="requirements"></a>
## 요구 사항

- **bash**(macOS에 기본 내장된 3.2 버전으로 충분합니다)와 coreutils `date`
- **[jq](https://jqlang.github.io/jq/)** — Claude Code의 상태 JSON을 읽고 설정을 안전하게 편집하는 데 사용됩니다
  - macOS: `brew install jq`
  - Debian/Ubuntu: `sudo apt-get install jq`
  - Fedora: `sudo dnf install jq` · Arch: `sudo pacman -S jq` · Alpine: `sudo apk add jq`

## 설정

언제든지 마법사를 실행하세요:

```sh
ccbar config
```

마법사는 `~/.config/ccbar/config`에 직접 손으로 편집할 수 있는 평범한 파일을 작성합니다:

| Key                 | Default | Description                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(비어 있음)* | 맨 앞에 표시되는 레이블(예: 회사 이름). 비워 두면 숨겨집니다.    |
| `CCBAR_THEME`       | `default` | 색상 테마: `default`, `mono`, `vivid` 중 하나.                      |
| `CCBAR_BAR_WIDTH`   | `10`    | 각 사용량 막대의 너비(셀 단위).                                 |
| `CCBAR_BAR_FILLED`  | `█`     | 막대에서 채워진 부분을 나타내는 문자.                         |
| `CCBAR_BAR_EMPTY`   | `░`     | 막대에서 비어 있는 부분을 나타내는 문자.                          |
| `CCBAR_SHOW_EFFORT` | `1`     | 노력 수준 표시 여부(`1`/`0`).                                   |
| `CCBAR_SHOW_CTX`    | `1`     | 컨텍스트 창 막대 표시 여부(`1`/`0`).                             |
| `CCBAR_SHOW_5H`     | `1`     | 5시간 사용량 막대 표시 여부(`1`/`0`).                             |
| `CCBAR_SHOW_7D`     | `1`     | 7일 사용량 막대 표시 여부(`1`/`0`).                              |

모든 값에는 합리적인 기본값이 있으므로, 설정이 없거나 일부만 있어도 문제없이 렌더링됩니다.

### 테마

| Theme     | Look                                   |
| --------- | -------------------------------------- |
| `default` | 은은하고 톤 다운된 색상(권장)    |
| `mono`    | 회색조만 사용 — 어떤 프롬프트에도 자연스럽게 어울림 |
| `vivid`   | 밝고 대비가 강한 색상           |

## 명령어

대화형 설정 마법사를 실행합니다.

```sh
ccbar config
```

프리셋 모양을 둘러보고 원하면 하나를 적용합니다.

```sh
ccbar gallery
```

샘플 데이터로 상태 표시줄을 미리 봅니다.

```sh
ccbar demo
```

stdin으로 Claude Code의 상태 JSON을 읽어 막대를 출력합니다 (Claude Code 자체가 호출하는 명령입니다).

```sh
ccbar render
```

Claude Code 설정에서 ccbar 연결을 제거합니다.

```sh
ccbar uninstall
```

버전을 출력합니다.

```sh
ccbar version
```

도움말을 표시합니다.

```sh
ccbar help
```

> `ccbar` 명령은 `~/.local/bin`에 있습니다. 이 경로가 `PATH`에 없다면 추가하세요:
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
> ```
> 상태 표시줄 자체는 절대 경로를 사용하므로 `PATH` 설정과 관계없이 동작합니다.

## 작동 방식

Claude Code는 [사용자 지정 상태 표시줄](https://docs.claude.com/en/docs/claude-code/statusline)을 지원합니다. 명령을 실행하고 JSON 객체(모델, 워크스페이스, 컨텍스트 창, 사용 한도)를 그 stdin으로 파이프한 뒤, 명령이 출력하는 내용을 그대로 표시합니다. `ccbar`는 그 JSON을 `jq`로 읽어 두 줄짜리 막대를 렌더링합니다.

설치 프로그램은 다음 내용을 `~/.claude/settings.json`에 추가합니다(기존의 다른 설정을 덮어쓰지 않고 병합합니다):

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
## 수동 설치

```sh
# 1. 스크립트를 다운로드합니다
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. 설정합니다
~/.local/bin/ccbar config

# 3. Claude Code가 이를 사용하도록 지정합니다 (~/.claude/settings.json에 추가)
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## 제거

```sh
ccbar uninstall
```

`~/.claude/settings.json`에서 `statusLine` 항목을 제거하고(`.bak` 백업을 남깁니다), 선택적으로 바이너리와 설정을 삭제합니다.

## 문제 해결

- **상태 표시줄이 나타나지 않음** — *새* Claude Code 세션을 시작하세요. 상태 표시줄은 세션 시작 시점에 로드됩니다.
- **`jq not found`** — `jq`를 설치하세요([요구 사항](#requirements) 참고).
- **막대의 문자가 깨져 보임** — 터미널 폰트에 블록 글리프가 없을 수 있습니다. `ccbar config`를 실행하고 `=-` ascii 막대 스타일을 선택하세요.

## 기여하기

이슈와 PR을 환영합니다. `ccbar`는 빌드 단계가 없는 단일 이식성 bash 스크립트(`bin/ccbar`)입니다. 스크립트를 편집한 뒤 `bin/ccbar demo`를 실행해 미리 보세요.

## 라이선스

[MIT](../LICENSE) © Lakpriya Senevirathna
