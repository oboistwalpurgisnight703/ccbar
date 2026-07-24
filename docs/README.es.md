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

- **Línea 1** — una insignia opcional de organización/etiqueta, el nombre del modelo, el nivel de esfuerzo actual, el directorio del espacio de trabajo y (opcionalmente) el **costo de sesión** en curso.
- **Línea 2** — barras de uso coloreadas para tu **ventana de contexto**, el límite de tasa de **5 horas** y el límite de tasa de **7 días**, cada una con una cuenta atrás hasta el momento en que se reinicia.

Las barras cambian de 🟢 verde → 🟡 amarillo → 🔴 rojo a medida que se llenan, así puedes ver de un vistazo cuánto margen te queda.

Dos extras te ayudan a gestionar tus ventanas de límite de tasa:

- **Ventana de 5 horas inactiva** — antes de que hayas enviado tu primer mensaje, la ventana de 5 horas no ha empezado, así que ccbar muestra `5h idle` para indicar que el reloj no está corriendo. (El límite de 5 horas de Claude es una ventana móvil anclada a tu primer mensaje — enviar un mensaje rápido y desechable mientras estás inactivo inicia la ventana antes de tiempo y acorta cualquier espera posterior).
- **Advertencia de ritmo de consumo** *(opcional)* — cuando tu ritmo actual proyecta agotar un límite *antes* de que se reinicie, ccbar añade una estimación `⚠ <time>` a esa barra. Desactivada de forma predeterminada; actívala en `ccbar config`.

Más allá de la línea de estado, ccbar te ofrece dos comandos de terminal: **[`ccbar stats`](#usage-insights)** para un panel de uso ampliado, y **[`ccbar history`](#usage-insights)** para las tendencias de uso de los últimos 7 días.

---

## Instalación

```sh
npx ccbar-cli
```

O con curl:

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
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
| `CCBAR_SHOW_COST`   | `0`     | Muestra el costo de sesión en curso en la línea 1 (`1`/`0`).                 |
| `CCBAR_SHOW_BURN`   | `0`     | Advierte (`⚠ <time>`) cuando tu ritmo agotará un límite antes de tiempo (`1`/`0`). |
| `CCBAR_HISTORY`     | `1`     | Registra instantáneas de uso para `ccbar history` (`1`/`0`).              |

Cada valor tiene un valor predeterminado sensato, por lo que una configuración ausente o parcial se sigue renderizando correctamente.

### Temas

| Tema      | Aspecto                                |
| --------- | -------------------------------------- |
| `default` | Colores sutiles y atenuados (recomendado)    |
| `mono`    | Solo escala de grises — se integra en cualquier prompt |
| `vivid`   | Colores brillantes y de alto contraste           |

## Comandos

Muestra un panel de uso ampliado (consulta [Perspectivas de uso](#usage-insights)).

```sh
ccbar stats
```

Muestra las tendencias de uso de los últimos 7 días (consulta [Perspectivas de uso](#usage-insights)).

```sh
ccbar history
```

Ejecuta el asistente de configuración interactivo.

```sh
ccbar config
```

Explora aspectos preconfigurados y, opcionalmente, aplica uno.

```sh
ccbar gallery
```

Previsualiza con datos de ejemplo — la línea de estado, o (con `stats`/`history`) cualquiera de los paneles de uso.

```sh
ccbar demo
ccbar demo stats
ccbar demo history
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

<a id="usage-insights"></a>
## Perspectivas de uso

ccbar **no hace llamadas de red** y **no tiene credenciales** — solo ve el JSON que Claude Code canaliza a `ccbar render`. Para hacer que esos datos sean útiles fuera de la línea de estado, `render` almacena en caché el payload más reciente (y registra un pequeño historial móvil), que dos comandos leen de vuelta. Pruébalos con datos de ejemplo mediante `ccbar demo stats` y `ccbar demo history`.

### `ccbar stats`

Un panel de uso ampliado y bajo demanda — modelo, sesión (5h), semanal (7d), contexto, costo, cuentas atrás de reinicio y tu ritmo actual:

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

Lee el payload más reciente que Claude Code le pasó a `ccbar render` (capturado en cada redibujado y sellado con hace cuánto tiempo ocurrió). Canaliza JSON nuevo — `… | ccbar stats` — para reemplazarlo.

### `ccbar history`

Tendencias de uso de los últimos 7 días — una sparkline de los picos diarios de 5 horas, el uso semanal actual, una tabla por día (pico de % 5h/7d, costo estimado) y tu ritmo de consumo medido:

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

`render` registra una instantánea limitada (como máximo una por minuto) en `${XDG_STATE_HOME:-~/.local/state}/ccbar/history.tsv`, y `history` la resume. Solo refleja el tiempo que Claude Code estuvo abierto, y el costo diario es una estimación (sumada por sesión). Establece `CCBAR_HISTORY=0` para desactivar el registro por completo; borra el archivo para reiniciarlo.

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
