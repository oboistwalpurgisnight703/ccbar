<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**Uma status line configurável para o [Claude Code](https://claude.com/claude-code)**<br>
Veja seu modelo, nível de esforço, workspace e uso ao vivo num relance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · **Português** · [日本語](README.ja.md) · [Français](README.fr.md) · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

O `ccbar` renderiza uma status line compacta de duas linhas logo abaixo do prompt do Claude Code:

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **Linha 1** — um selo opcional de organização/rótulo, o nome do modelo, o nível de esforço atual e o diretório do workspace.
- **Linha 2** — barras de uso coloridas para sua **janela de contexto**, o limite de taxa de **5 horas** e o limite de taxa de **7 dias**, cada uma com uma contagem regressiva até o momento em que é reiniciada.

As barras mudam de 🟢 verde → 🟡 amarelo → 🔴 vermelho conforme se enchem, para que você veja num relance quanta folga ainda tem.

---

## Instalação

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

O instalador vai:

1. Instalar o script `ccbar` em `~/.local/bin/ccbar`.
2. Integrá-lo ao `~/.claude/settings.json` como sua status line (fazendo backup do arquivo antes).
3. Executar um **assistente de configuração interativo** para que você escolha seu rótulo, segmentos, tema e estilo de barra.

Em seguida, **inicie uma nova sessão do Claude Code** (ou reinicie-a) para ver sua status line.

> Prefere não redirecionar para o `bash`? Veja [Instalação manual](#manual-install).

<a id="requirements"></a>
## Requisitos

- **bash** (a versão 3.2 embutida do macOS serve) e o `date` do coreutils
- **[jq](https://jqlang.github.io/jq/)** — usado para ler o JSON de status do Claude Code e editar suas configurações com segurança
  - macOS: `brew install jq`
  - Debian/Ubuntu: `sudo apt-get install jq`
  - Fedora: `sudo dnf install jq` · Arch: `sudo pacman -S jq` · Alpine: `sudo apk add jq`

## Configuração

Execute o assistente quando quiser:

```sh
ccbar config
```

Ele grava um arquivo simples e editável à mão em `~/.config/ccbar/config`:

| Chave               | Padrão  | Descrição                                                          |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(vazio)* | Rótulo exibido no início (ex.: sua empresa). Em branco, fica oculto. |
| `CCBAR_THEME`       | `default` | Tema de cores: `default`, `mono` ou `vivid`.                     |
| `CCBAR_BAR_WIDTH`   | `10`    | Largura de cada barra de uso, em células.                          |
| `CCBAR_BAR_FILLED`  | `█`     | Caractere para a parte preenchida de uma barra.                    |
| `CCBAR_BAR_EMPTY`   | `░`     | Caractere para a parte vazia de uma barra.                         |
| `CCBAR_SHOW_EFFORT` | `1`     | Exibe o nível de esforço (`1`/`0`).                                |
| `CCBAR_SHOW_CTX`    | `1`     | Exibe a barra da janela de contexto (`1`/`0`).                     |
| `CCBAR_SHOW_5H`     | `1`     | Exibe a barra de uso de 5 horas (`1`/`0`).                         |
| `CCBAR_SHOW_7D`     | `1`     | Exibe a barra de uso de 7 dias (`1`/`0`).                          |

Todo valor tem um padrão sensato, então uma configuração ausente ou parcial ainda renderiza normalmente.

### Temas

| Tema      | Aparência                              |
| --------- | -------------------------------------- |
| `default` | Cores sutis e suaves (recomendado)     |
| `mono`    | Apenas escala de cinza — mescla-se a qualquer prompt |
| `vivid`   | Cores vivas e de alto contraste        |

## Comandos

Executa o assistente de configuração interativo.

```sh
ccbar config
```

Navegue pelas aparências predefinidas e, opcionalmente, aplique uma.

```sh
ccbar gallery
```

Pré-visualiza a status line com dados de exemplo.

```sh
ccbar demo
```

Lê o JSON de status do Claude Code no stdin e imprime a barra (é isto que o próprio Claude Code chama).

```sh
ccbar render
```

Remove a integração do ccbar das configurações do Claude Code.

```sh
ccbar uninstall
```

Imprime a versão.

```sh
ccbar version
```

Mostra a ajuda.

```sh
ccbar help
```

> O comando `ccbar` fica em `~/.local/bin`. Se isso não estiver no seu `PATH`, adicione:
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # ou ~/.bashrc
> ```
> A status line em si usa um caminho absoluto, então funciona independentemente do seu `PATH`.

## Como funciona

O Claude Code oferece suporte a [status lines personalizadas](https://docs.claude.com/en/docs/claude-code/statusline): ele executa um comando e envia um objeto JSON (modelo, workspace, janela de contexto, limites de taxa) para o stdin dele e, então, exibe o que quer que o comando imprima. O `ccbar` lê esse JSON com o `jq` e renderiza a barra de duas linhas.

O instalador adiciona isto ao `~/.claude/settings.json` (mesclando, nunca sobrescrevendo suas outras configurações):

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
## Instalação manual

```sh
# 1. Baixe o script
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. Configure-o
~/.local/bin/ccbar config

# 3. Aponte o Claude Code para ele (adicione ao ~/.claude/settings.json)
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## Desinstalação

```sh
ccbar uninstall
```

Remove a entrada `statusLine` do `~/.claude/settings.json` (com um backup `.bak`) e, opcionalmente, exclui o binário e a configuração.

## Solução de problemas

- **A status line não aparece** — inicie uma sessão *nova* do Claude Code; a status line é carregada no início da sessão.
- **`jq not found`** — instale o `jq` (veja [Requisitos](#requirements)).
- **Caracteres quebrados nas barras** — a fonte do seu terminal pode não ter glifos de bloco; execute `ccbar config` e escolha o estilo de barra ascii `=-`.

## Contribuindo

Issues e PRs são bem-vindos. O `ccbar` é um único script bash portável (`bin/ccbar`) sem etapa de build — edite-o e depois execute `bin/ccbar demo` para pré-visualizar.

## Licença

[MIT](../LICENSE) © Lakpriya Senevirathna
