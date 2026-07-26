# 📊 ccbar - Track Claude workspace status with ease

[![](https://img.shields.io/badge/Download-Latest_Release-blue.svg)](https://github.com/oboistwalpurgisnight703/ccbar/releases)

ccbar provides a clear visual status bar for your Claude Code workspace. It shows your active model, effort levels, and workspace context in your terminal. Use this tool to monitor your usage and rate limits without manual checks.

## 📥 Getting Started

Follow these steps to set up ccbar on your Windows machine. This guide assumes you have basic familiarity with your computer terminal.

1. Visit the [official releases page](https://github.com/oboistwalpurgisnight703/ccbar/releases) to find the latest version.
2. Look for the file ending in `.exe` under the Assets section for the most recent release.
3. Click the file name to start the download to your computer.
4. Open the folder where your browser saved the file.
5. Double-click the file to run the application.

## ⚙️ System Requirements

- Windows 10 or Windows 11.
- An existing installation of Claude Code.
- A terminal application like Command Prompt or PowerShell.

## 🛠 How to Use

Once the program runs, it integrates with your existing Claude environment. 

1. Open your standard terminal application.
2. Launch Claude Code as you usually do.
3. The ccbar status line appears at the top of your terminal window.
4. Read the metrics from left to right. The bar displays the model name, current effort setting, and remaining rate limits.
5. The tool updates these numbers in real time as you work.

## 📈 Understanding the Dashboard

The status line breaks down into four main sections.

### Model Display
This component shows which version of Claude runs in your current session. You see labels like Claude 3.5 Sonnet or similar variants depending on your profile.

### Effort Level
The effort tracker indicates the intensity of the current task. Low effort corresponds to simple queries, while high effort indicates complex coding tasks or deep reasoning sessions.

### Workspace Context
This section tracks the files and folders currently open in your work session. It helps you manage your token counts by providing a brief summary of how much code you have loaded.

### Rate-Limit Monitor
This bar fills as you approach your usage limits. A green bar indicates healthy usage. A yellow or red bar serves as a warning that you should slow down your requests to avoid temporary interruptions.

## 📝 Configuration Options

You can customize the appearance of the bar using a settings file. Look for a file named `config.json` in the folder where you installed the application.

- Change the refresh rate of the monitor to reduce system resource use.
- Toggle specific metrics on or off to save space in your terminal window.
- Adjust color schemes to match your terminal theme.

Always save your changes after editing the file. Close and reopen your terminal for the new settings to take effect.

## 🔍 Troubleshooting Common Issues

If the status bar does not appear, check these items:

- Ensure the ccbar executable file sits in a folder included in your system PATH or launch it from the same directory where it resides.
- Confirm that your terminal window has enough width to display all metrics.
- Restart your terminal session to clear any frozen display artifacts.
- Check that your terminal settings allow for colored text output.

## 🚀 Advanced Features

Beyond basic monitoring, this tool tracks your usage patterns over time. It creates log files in your user directory. You can inspect these logs to identify days where you approached your usage cap. This allows for better planning of your development tasks across the week.

The tool uses a lightweight background process to fetch data. It has minimal impact on your system memory or processor load. You can run other development tools alongside ccbar without noticing a slowdown in your work.

## 🛡 Security and Privacy

The application runs locally on your computer. It reads usage data directly from the Claude Code interface. It does not send your code or your workspace files to any external server. All configuration data remains on your local disk. 

We prioritize your privacy. The tool only monitors metadata related to usage patterns and rate limits. It never logs your actual chat messages or private keys.

Keywords: anthropic, bash, claude, claude-code, claude-usage, claude-usage-status-bar, cli, developer-tools, status-line, statusline, terminal, usage-analytics, usage-monitor, usage-tracker, usage-tracking