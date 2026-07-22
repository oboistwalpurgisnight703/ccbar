<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**Une status line configurable pour [Claude Code](https://claude.com/claude-code)**<br>
Visualisez votre modèle, votre niveau d'effort, votre espace de travail et votre utilisation en temps réel d'un coup d'œil.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [Português](README.pt-BR.md) · [日本語](README.ja.md) · **Français** · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

`ccbar` affiche une status line compacte sur deux lignes sous votre invite Claude Code :

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **Ligne 1** — un badge org/label optionnel, le nom du modèle, le niveau d'effort actuel et le répertoire de l'espace de travail.
- **Ligne 2** — des barres d'utilisation colorées pour votre **fenêtre de contexte**, votre limite de débit sur **5 heures** et votre limite de débit sur **7 jours**, chacune accompagnée d'un compte à rebours jusqu'à sa réinitialisation.

Les barres passent du 🟢 vert au 🟡 jaune puis au 🔴 rouge à mesure qu'elles se remplissent, ce qui vous permet de voir d'un coup d'œil la marge qu'il vous reste.

---

## Installation

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

Chaque valeur possède une valeur par défaut raisonnable, si bien qu'une configuration manquante ou partielle s'affiche tout de même correctement.

### Thèmes

| Thème     | Apparence                                   |
| --------- | -------------------------------------- |
| `default` | Couleurs discrètes et atténuées (recommandé)    |
| `mono`    | Niveaux de gris uniquement — se fond dans n'importe quelle invite |
| `vivid`   | Couleurs vives et très contrastées           |

## Commandes

Lance l'assistant de configuration interactif.

```sh
ccbar config
```

Parcourez les presets et appliquez-en un si vous le souhaitez.

```sh
ccbar gallery
```

Prévisualise la status line avec des données d'exemple.

```sh
ccbar demo
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

### Gallery

Vous ne savez pas quel style choisir ? Parcourez un ensemble de presets sélectionnés — chacun étant une combinaison de thème, de style de barre et de largeur — et appliquez-en un en une touche :

```sh
ccbar gallery
```

Elle affiche chaque preset rendu avec des données d'exemple, puis (dans un terminal) vous demande lequel appliquer. Appliquer un preset ne modifie que le thème et le style des barres — votre org/label et l'affichage de vos segments sont conservés. Lancez-la avec un pipe (par ex. `ccbar gallery | less`) pour simplement parcourir sans l'invite.

> La commande `ccbar` se trouve dans `~/.local/bin`. Si ce répertoire n'est pas dans votre `PATH`, ajoutez-le :
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # ou ~/.bashrc
> ```
> La status line elle-même utilise un chemin absolu, elle fonctionne donc quel que soit votre `PATH`.

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
