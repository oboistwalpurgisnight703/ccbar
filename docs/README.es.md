<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**Una línea de estado configurable para [Claude Code](https://claude.com/claude-code)**<br>
Consulta tu modelo, nivel de esfuerzo, espacio de trabajo y uso en tiempo real de un vistazo.

[![npm](https://img.shields.io/npm/v/ccbar-cli?color=cb3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/ccbar-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · **Español** · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

`ccbar` renderiza una línea de estado compacta de dos líneas debajo de tu prompt de Claude Code:

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **Línea 1** — una insignia opcional de organización/etiqueta, el nombre del modelo, el nivel de esfuerzo actual y el directorio del espacio de trabajo.
- **Línea 2** — barras de uso coloreadas para tu **ventana de contexto**, el límite de tasa de **5 horas** y el límite de tasa de **7 días**, cada una con una cuenta atrás hasta el momento en que se reinicia.

Las barras cambian de 🟢 verde → 🟡 amarillo → 🔴 rojo a medida que se llenan, así puedes ver de un vistazo cuánto margen te queda.

---

## Instalación

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

O con npm:

```sh
npx ccbar-cli
```

El instalador hará lo siguiente:

1. Instalar el script `ccbar` en `~/.local/bin/ccbar`.
2. Integrarlo en `~/.claude/settings.json` como tu línea de estado (haciendo primero una copia de seguridad del archivo).
3. Ejecutar un **asistente de configuración interactivo** para que puedas elegir tu etiqueta, segmentos, tema y estilo de barra.

Luego **inicia una nueva sesión de Claude Code** (o reiníciala) para ver tu línea de estado.

> ¿Prefieres no canalizar la salida a `bash`? Consulta [Instalación manual](#manual-install).

<a id="requirements"></a>
## Requisitos

- **bash** (la versión 3.2 integrada en macOS es suficiente) y `date` de coreutils
- **[jq](https://jqlang.github.io/jq/)** — se usa para leer el JSON de estado de Claude Code y para editar tu configuración de forma segura
  - macOS: `brew install jq`
  - Debian/Ubuntu: `sudo apt-get install jq`
  - Fedora: `sudo dnf install jq` · Arch: `sudo pacman -S jq` · Alpine: `sudo apk add jq`

## Configuración

Ejecuta el asistente en cualquier momento:

```sh
ccbar config
```

Escribe un archivo sencillo y editable a mano en `~/.config/ccbar/config`:

| Key                 | Predeterminado | Descripción                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(vacío)* | Etiqueta mostrada al principio (p. ej. tu empresa). En blanco la oculta.    |
| `CCBAR_THEME`       | `default` | Tema de color: `default`, `mono` o `vivid`.                      |
| `CCBAR_BAR_WIDTH`   | `10`    | Ancho de cada barra de uso, en celdas.                                 |
| `CCBAR_BAR_FILLED`  | `█`     | Carácter para la parte llena de una barra.                         |
| `CCBAR_BAR_EMPTY`   | `░`     | Carácter para la parte vacía de una barra.                          |
| `CCBAR_SHOW_EFFORT` | `1`     | Muestra el nivel de esfuerzo (`1`/`0`).                                   |
| `CCBAR_SHOW_CTX`    | `1`     | Muestra la barra de la ventana de contexto (`1`/`0`).                             |
| `CCBAR_SHOW_5H`     | `1`     | Muestra la barra de uso de 5 horas (`1`/`0`).                             |
| `CCBAR_SHOW_7D`     | `1`     | Muestra la barra de uso de 7 días (`1`/`0`).                              |

Cada valor tiene un valor predeterminado sensato, por lo que una configuración ausente o parcial se sigue renderizando correctamente.

### Temas

| Tema      | Aspecto                                |
| --------- | -------------------------------------- |
| `default` | Colores sutiles y atenuados (recomendado)    |
| `mono`    | Solo escala de grises — se integra en cualquier prompt |
| `vivid`   | Colores brillantes y de alto contraste           |

## Comandos

Run the interactive setup wizard.

```sh
ccbar config
```

Explora aspectos preconfigurados y, opcionalmente, aplica uno.

```sh
ccbar gallery
```

Preview the status line with sample data.

```sh
ccbar demo
```

Read Claude Code's status JSON on stdin and print the bar (this is what Claude Code itself calls).

```sh
ccbar render
```

Remove ccbar's wiring from Claude Code settings.

```sh
ccbar uninstall
```

Print the version.

```sh
ccbar version
```

Show help.

```sh
ccbar help
```

> El comando `ccbar` reside en `~/.local/bin`. Si eso no está en tu `PATH`, añádelo:
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
> ```
> La línea de estado en sí usa una ruta absoluta, por lo que funciona independientemente de tu `PATH`.

## Cómo funciona

Claude Code admite [líneas de estado personalizadas](https://docs.claude.com/en/docs/claude-code/statusline): ejecuta un comando y canaliza un objeto JSON (modelo, espacio de trabajo, ventana de contexto, límites de tasa) a su stdin, y luego muestra lo que sea que imprima el comando. `ccbar` lee ese JSON con `jq` y renderiza la barra de dos líneas.

El instalador añade esto a `~/.claude/settings.json` (fusionándolo, sin sobrescribir nunca tus otras configuraciones):

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
## Instalación manual

```sh
# 1. Descarga el script
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. Configúralo
~/.local/bin/ccbar config

# 3. Apunta Claude Code a él (añádelo a ~/.claude/settings.json)
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## Desinstalación

```sh
ccbar uninstall
```

Elimina la entrada `statusLine` de `~/.claude/settings.json` (con una copia de seguridad `.bak`) y, opcionalmente, borra el binario y la configuración.

## Solución de problemas

- **La línea de estado no aparece** — inicia una sesión *nueva* de Claude Code; la línea de estado se carga al inicio de la sesión.
- **`jq not found`** — instala `jq` (consulta [Requisitos](#requirements)).
- **Caracteres rotos en las barras** — puede que la fuente de tu terminal carezca de glifos de bloque; ejecuta `ccbar config` y elige el estilo de barra ascii `=-`.

## Contribuir

Se agradecen los issues y PRs. `ccbar` es un único script portable de bash (`bin/ccbar`) sin paso de compilación — edítalo y luego ejecuta `bin/ccbar demo` para previsualizarlo.

## Licencia

[MIT](../LICENSE) © Lakpriya Senevirathna
