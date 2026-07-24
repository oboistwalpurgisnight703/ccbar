<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**Une status line configurable pour [Claude Code](https://claude.com/claude-code)**<br>
Visualisez votre modèle, votre niveau d'effort, votre espace de travail et votre utilisation en temps réel d'un coup d'œil.

[![npm](https://img.shields.io/npm/v/ccbar-cli?color=cb3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/ccbar-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · [日本語](README.ja.md) · **Français** · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

`ccbar` affiche une status line compacte sur deux lignes sous votre invite Claude Code :

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **Ligne 1** — un badge org/label optionnel, le nom du modèle, le niveau d'effort actuel, le répertoire de l'espace de travail et (optionnellement) le **coût de la session** en cours.
- **Ligne 2** — des barres d'utilisation colorées pour votre **fenêtre de contexte**, votre limite de débit sur **5 heures** et votre limite de débit sur **7 jours**, chacune accompagnée d'un compte à rebours jusqu'à sa réinitialisation.

Les barres passent du 🟢 vert au 🟡 jaune puis au 🔴 rouge à mesure qu'elles se remplissent, ce qui vous permet de voir d'un coup d'œil la marge qu'il vous reste.

Deux extras vous aident à gérer vos fenêtres de limite de débit :

- **Fenêtre de 5 heures inactive** — avant l'envoi de votre premier message, la fenêtre de 5 heures n'a pas encore démarré, ccbar affiche donc `5h idle` pour signaler que le compteur n'est pas lancé. (La limite de 5 heures de Claude est une fenêtre glissante ancrée à votre premier message — envoyer un message jetable rapide pendant que vous êtes inactif démarre la fenêtre plus tôt et raccourcit l'attente éventuelle.)
- **Avertissement de rythme de consommation** *(optionnel)* — lorsque votre rythme actuel projette d'épuiser une limite *avant* sa réinitialisation, ccbar ajoute une estimation `⚠ <time>` à cette barre. Désactivé par défaut ; activez-le dans `ccbar config`.

Au-delà de la status line, ccbar vous propose deux commandes de terminal : **[`ccbar stats`](#usage-insights)** pour un panneau d'utilisation détaillé, et **[`ccbar history`](#usage-insights)** pour les tendances d'utilisation sur 7 jours.

---

## Installation

```sh
npx ccbar-cli
```

Ou avec curl :

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

Le programme d'installation va :

1. Installer le script `ccbar` dans `~/.local/bin/ccbar`.
2. L'intégrer à `~/.claude/settings.json` comme votre status line (en sauvegardant d'abord le fichier).
3. Lancer un **assistant de configuration interactif** pour que vous puissiez choisir votre label, vos segments, votre thème et le style des barres.

Ensuite, **démarrez une nouvelle session Claude Code** (ou redémarrez-la) pour voir votre status line.

> Vous préférez ne pas rediriger vers `bash` ? Consultez [Installation manuelle](#manual-install).

<a id="requirements"></a>
## Prérequis

- **bash** (la version 3.2 intégrée à macOS convient) et la commande `date` de coreutils
- **[jq](https://jqlang.github.io/jq/)** — utilisé pour lire le JSON de statut de Claude Code et pour modifier vos paramètres en toute sécurité
  - macOS : `brew install jq`
  - Debian/Ubuntu : `sudo apt-get install jq`
  - Fedora : `sudo dnf install jq` · Arch : `sudo pacman -S jq` · Alpine : `sudo apk add jq`

## Configuration

Lancez l'assistant à tout moment :

```sh
ccbar config
```

Il écrit un fichier simple et modifiable à la main dans `~/.config/ccbar/config` :

| Clé                 | Valeur par défaut | Description                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(vide)* | Label affiché au début (par ex. votre entreprise). Laissé vide, il est masqué.    |
| `CCBAR_THEME`       | `default` | Thème de couleurs : `default`, `mono` ou `vivid`.                      |
| `CCBAR_BAR_WIDTH`   | `10`    | Largeur de chaque barre d'utilisation, en cellules.                                 |
| `CCBAR_BAR_FILLED`  | `█`     | Caractère pour la partie remplie d'une barre.                         |
| `CCBAR_BAR_EMPTY`   | `░`     | Caractère pour la partie vide d'une barre.                          |
| `CCBAR_SHOW_EFFORT` | `1`     | Afficher le niveau d'effort (`1`/`0`).                                   |
| `CCBAR_SHOW_CTX`    | `1`     | Afficher la barre de la fenêtre de contexte (`1`/`0`).                             |
| `CCBAR_SHOW_5H`     | `1`     | Afficher la barre d'utilisation sur 5 heures (`1`/`0`).                              |
| `CCBAR_SHOW_7D`     | `1`     | Afficher la barre d'utilisation sur 7 jours (`1`/`0`).                                |
| `CCBAR_SHOW_COST`   | `0`     | Afficher le coût de la session en cours sur la ligne 1 (`1`/`0`).                 |
| `CCBAR_SHOW_BURN`   | `0`     | Avertir (`⚠ <time>`) lorsque votre rythme va épuiser une limite en avance (`1`/`0`). |
| `CCBAR_HISTORY`     | `1`     | Enregistrer des instantanés d'utilisation pour `ccbar history` (`1`/`0`).              |

Chaque valeur possède une valeur par défaut raisonnable, si bien qu'une configuration manquante ou partielle s'affiche tout de même correctement.

### Thèmes

| Thème     | Apparence                                   |
| --------- | -------------------------------------- |
| `default` | Couleurs discrètes et atténuées (recommandé)    |
| `mono`    | Niveaux de gris uniquement — se fond dans n'importe quelle invite |
| `vivid`   | Couleurs vives et très contrastées           |

## Commandes

Affiche un panneau d'utilisation détaillé (voir [Aperçus d'utilisation](#usage-insights)).

```sh
ccbar stats
```

Affiche les tendances d'utilisation sur 7 jours (voir [Aperçus d'utilisation](#usage-insights)).

```sh
ccbar history
```

Lance l'assistant de configuration interactif.

```sh
ccbar config
```

Parcourez les presets et appliquez-en un si vous le souhaitez.

```sh
ccbar gallery
```

Prévisualise avec des données d'exemple — la status line, ou (avec `stats`/`history`) l'un ou l'autre panneau d'utilisation.

```sh
ccbar demo
ccbar demo stats
ccbar demo history
```

Lit le JSON de statut de Claude Code sur stdin et affiche la barre (c'est ce que Claude Code lui-même appelle).

```sh
ccbar render
```

Retire l'intégration de ccbar des paramètres de Claude Code.

```sh
ccbar uninstall
```

Affiche la version.

```sh
ccbar version
```

Affiche l'aide.

```sh
ccbar help
```

> La commande `ccbar` se trouve dans `~/.local/bin`. Si ce répertoire n'est pas dans votre `PATH`, ajoutez-le :
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # ou ~/.bashrc
> ```
> La status line elle-même utilise un chemin absolu, elle fonctionne donc quel que soit votre `PATH`.

<a id="usage-insights"></a>
## Aperçus d'utilisation

ccbar n'effectue **aucun appel réseau** et n'a **aucun identifiant** — il ne voit jamais que le JSON que Claude Code transmet à `ccbar render`. Pour rendre ces données utiles en dehors de la status line, `render` met en cache la dernière charge utile (et enregistre un petit historique glissant), que deux commandes relisent. Essayez-les avec des données d'exemple via `ccbar demo stats` et `ccbar demo history`.

### `ccbar stats`

Un panneau d'utilisation détaillé, à la demande — modèle, session (5h), hebdomadaire (7j), contexte, coût, comptes à rebours de réinitialisation et votre rythme actuel :

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

Il lit la charge utile la plus récente que Claude Code a transmise à `ccbar render` (capturée à chaque redessin et horodatée avec le temps écoulé depuis). Redirigez du JSON frais en entrée — `… | ccbar stats` — pour la remplacer.

### `ccbar history`

Les tendances d'utilisation sur les 7 derniers jours — un sparkline des pics quotidiens sur 5 heures, l'utilisation hebdomadaire actuelle, un tableau par jour (pic % 5h/7d, coût estimé) et votre rythme de consommation mesuré :

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

`render` enregistre un instantané limité (au plus un par minute) dans `${XDG_STATE_HOME:-~/.local/state}/ccbar/history.tsv`, et `history` en fait la synthèse. Cela ne reflète que le temps pendant lequel Claude Code était ouvert, et le coût quotidien est une estimation (sommée par session). Définissez `CCBAR_HISTORY=0` pour désactiver complètement l'enregistrement ; supprimez le fichier pour réinitialiser.

## Fonctionnement

Claude Code prend en charge les [status lines personnalisées](https://docs.claude.com/en/docs/claude-code/statusline) : il exécute une commande et transmet un objet JSON (modèle, espace de travail, fenêtre de contexte, limites de débit) à son stdin, puis affiche ce que la commande imprime. `ccbar` lit ce JSON avec `jq` et affiche la barre sur deux lignes.

Le programme d'installation ajoute ceci à `~/.claude/settings.json` (en fusionnant, sans jamais écraser vos autres paramètres) :

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
## Installation manuelle

```sh
# 1. Télécharger le script
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. Le configurer
~/.local/bin/ccbar config

# 3. Diriger Claude Code vers lui (ajouter à ~/.claude/settings.json)
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## Désinstallation

```sh
ccbar uninstall
```

Retire l'entrée `statusLine` de `~/.claude/settings.json` (avec une sauvegarde `.bak`) et supprime éventuellement le binaire et la configuration.

## Dépannage

- **La status line n'apparaît pas** — démarrez une *nouvelle* session Claude Code ; la status line se charge au démarrage de la session.
- **`jq not found`** — installez `jq` (voir [Prérequis](#requirements)).
- **Caractères cassés dans les barres** — la police de votre terminal ne dispose peut-être pas des glyphes de blocs ; lancez `ccbar config` et choisissez le style de barre ascii `=-`.

## Contribuer

Les issues et les PR sont les bienvenues. `ccbar` est un unique script bash portable (`bin/ccbar`) sans étape de build — modifiez-le, puis lancez `bin/ccbar demo` pour prévisualiser.

## Licence

[MIT](../LICENSE) © Lakpriya Senevirathna
