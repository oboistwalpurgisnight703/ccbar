<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/ccbar-logo-horizontal-dark.svg">
  <img src="../assets/ccbar-logo-horizontal.svg" alt="ccbar — Claude Code status line" width="640">
</picture>

**[Claude Code](https://claude.com/claude-code) के लिए एक कॉन्फ़िगर करने योग्य स्टेटस लाइन**<br>
अपना मॉडल, एफर्ट लेवल, वर्कस्पेस और लाइव उपयोग एक नज़र में देखें।

[![npm](https://img.shields.io/npm/v/ccbar-cli?color=cb3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/ccbar-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Shell: bash](https://img.shields.io/badge/shell-bash-89e051.svg)](#requirements)

[English](../README.md) · [简体中文](README.zh-CN.md) · [Español](README.es.md) · **हिन्दी** · [Português](README.pt-BR.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [한국어](README.ko.md) · [සිංහල](README.si.md)

</div>

---

`ccbar` आपके Claude Code प्रॉम्प्ट के नीचे एक कॉम्पैक्ट दो-पंक्ति वाली स्टेटस लाइन रेंडर करता है:

<p align="center">
  <img src="../assets/ccbar-preview.png" alt="ccbar status line preview" width="760">
</p>

- **पंक्ति 1** — एक वैकल्पिक org/लेबल बैज, मॉडल का नाम, वर्तमान एफर्ट लेवल, वर्कस्पेस डायरेक्टरी, और (वैकल्पिक रूप से) चालू **सेशन कॉस्ट**।
- **पंक्ति 2** — आपके **कॉन्टेक्स्ट विंडो**, **5-घंटे** रेट लिमिट, और **7-दिन** रेट लिमिट के लिए रंगीन उपयोग बार, प्रत्येक के साथ यह दर्शाने वाला काउंटडाउन कि यह कब रीसेट होगा।

बार भरते-भरते 🟢 हरे → 🟡 पीले → 🔴 लाल हो जाते हैं, ताकि आप एक नज़र में देख सकें कि आपके पास कितनी हेडरूम बची है।

दो अतिरिक्त सुविधाएँ आपकी रेट-लिमिट विंडोज़ को प्रबंधित करने में मदद करती हैं:

- **आइडल 5-घंटे विंडो** — इससे पहले कि आप अपना पहला मैसेज भेजें, 5-घंटे की विंडो शुरू नहीं हुई होती, इसलिए ccbar `5h idle` दिखाता है ताकि यह संकेत मिले कि घड़ी नहीं चल रही है। (Claude की 5-घंटे की लिमिट एक रोलिंग विंडो है जो आपके पहले मैसेज पर टिकी होती है — आइडल रहते हुए एक जल्दी सा फालतू प्रॉम्प्ट भेजने से विंडो जल्दी शुरू हो जाती है और अंततः होने वाली प्रतीक्षा कम हो जाती है।)
- **बर्न-रेट चेतावनी** *(ऑप्ट-इन)* — जब आपकी वर्तमान गति के अनुमान से कोई लिमिट रीसेट होने से *पहले* ही समाप्त हो जाएगी, तो ccbar उस बार में एक `⚠ <time>` अनुमान जोड़ देता है। डिफ़ॉल्ट रूप से बंद; इसे `ccbar config` में सक्षम करें।

स्टेटस लाइन के अलावा, ccbar आपको दो टर्मिनल कमांड देता है: एक विस्तृत उपयोग पैनल के लिए **[`ccbar stats`](#usage-insights)**, और 7-दिन के उपयोग रुझानों के लिए **[`ccbar history`](#usage-insights)**।

---

## इंस्टॉल करें

```sh
npx ccbar-cli
```

या curl के साथ:

```sh
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/install.sh | bash
```

इंस्टॉलर निम्नलिखित करेगा:

1. `ccbar` स्क्रिप्ट को `~/.local/bin/ccbar` पर इंस्टॉल करेगा।
2. इसे आपकी स्टेटस लाइन के रूप में `~/.claude/settings.json` में जोड़ेगा (पहले फ़ाइल का बैकअप लेकर)।
3. एक **इंटरैक्टिव सेटअप विज़ार्ड** चलाएगा ताकि आप अपना लेबल, सेगमेंट, थीम और बार स्टाइल चुन सकें।

फिर अपनी स्टेटस लाइन देखने के लिए **एक नया Claude Code सेशन शुरू करें** (या इसे रीस्टार्ट करें)।

> `bash` को पाइप करना पसंद नहीं है? [मैनुअल इंस्टॉल](#manual-install) देखें।

<a id="requirements"></a>
## आवश्यकताएँ

- **bash** (macOS का बिल्ट-इन 3.2 ठीक है) और coreutils `date`
- **[jq](https://jqlang.github.io/jq/)** — Claude Code के स्टेटस JSON को पढ़ने और आपकी सेटिंग्स को सुरक्षित रूप से संपादित करने के लिए उपयोग किया जाता है
  - macOS: `brew install jq`
  - Debian/Ubuntu: `sudo apt-get install jq`
  - Fedora: `sudo dnf install jq` · Arch: `sudo pacman -S jq` · Alpine: `sudo apk add jq`

## कॉन्फ़िगरेशन

विज़ार्ड को कभी भी चलाएँ:

```sh
ccbar config
```

यह `~/.config/ccbar/config` पर एक सादी, हाथ से संपादित की जा सकने वाली फ़ाइल लिखता है:

| Key                 | Default | विवरण                                                        |
| ------------------- | ------- | ------------------------------------------------------------------ |
| `CCBAR_ORG`         | *(खाली)* | सामने दिखाया जाने वाला लेबल (जैसे आपकी कंपनी)। खाली छोड़ने पर छिप जाता है।    |
| `CCBAR_THEME`       | `default` | कलर थीम: `default`, `mono`, या `vivid`।                      |
| `CCBAR_BAR_WIDTH`   | `10`    | प्रत्येक उपयोग बार की चौड़ाई, सेल्स में।                                 |
| `CCBAR_BAR_FILLED`  | `█`     | बार के भरे हुए हिस्से के लिए वर्ण।                         |
| `CCBAR_BAR_EMPTY`   | `░`     | बार के खाली हिस्से के लिए वर्ण।                          |
| `CCBAR_SHOW_EFFORT` | `1`     | एफर्ट लेवल दिखाएँ (`1`/`0`)।                                   |
| `CCBAR_SHOW_CTX`    | `1`     | कॉन्टेक्स्ट-विंडो बार दिखाएँ (`1`/`0`)।                             |
| `CCBAR_SHOW_5H`     | `1`     | 5-घंटे का उपयोग बार दिखाएँ (`1`/`0`)।                              |
| `CCBAR_SHOW_7D`     | `1`     | 7-दिन का उपयोग बार दिखाएँ (`1`/`0`)।                               |
| `CCBAR_SHOW_COST`   | `0`     | पंक्ति 1 पर चालू सेशन कॉस्ट दिखाएँ (`1`/`0`)।                 |
| `CCBAR_SHOW_BURN`   | `0`     | चेतावनी दें (`⚠ <time>`) जब आपकी गति किसी लिमिट को जल्दी समाप्त कर देगी (`1`/`0`)। |
| `CCBAR_HISTORY`     | `1`     | `ccbar history` के लिए उपयोग स्नैपशॉट रिकॉर्ड करें (`1`/`0`)।              |

प्रत्येक मान का एक उचित डिफ़ॉल्ट है, इसलिए गायब या अधूरा कॉन्फ़िग भी सही ढंग से रेंडर होता है।

### थीम्स

| Theme     | रूप                                   |
| --------- | -------------------------------------- |
| `default` | सूक्ष्म, हल्के रंग (अनुशंसित)    |
| `mono`    | केवल ग्रेस्केल — किसी भी प्रॉम्प्ट में घुल-मिल जाता है |
| `vivid`   | चमकीले, उच्च-कंट्रास्ट रंग           |

## कमांड्स

एक विस्तृत उपयोग पैनल दिखाएँ ([उपयोग अंतर्दृष्टि](#usage-insights) देखें)।

```sh
ccbar stats
```

7-दिन के उपयोग रुझान दिखाएँ ([उपयोग अंतर्दृष्टि](#usage-insights) देखें)।

```sh
ccbar history
```

इंटरैक्टिव सेटअप विज़ार्ड चलाएँ।

```sh
ccbar config
```

प्रीसेट लुक्स ब्राउज़ करें और वैकल्पिक रूप से किसी एक को लागू करें।

```sh
ccbar gallery
```

नमूना डेटा के साथ पूर्वावलोकन करें — स्टेटस लाइन, या (`stats`/`history` के साथ) कोई भी उपयोग पैनल।

```sh
ccbar demo
ccbar demo stats
ccbar demo history
```

stdin पर Claude Code का स्टेटस JSON पढ़ें और बार प्रिंट करें (यही वह है जिसे Claude Code स्वयं कॉल करता है)।

```sh
ccbar render
```

Claude Code सेटिंग्स से ccbar की वायरिंग हटाएँ।

```sh
ccbar uninstall
```

वर्ज़न प्रिंट करें।

```sh
ccbar version
```

मदद दिखाएँ।

```sh
ccbar help
```

> `ccbar` कमांड `~/.local/bin` में रहता है। यदि वह आपके `PATH` पर नहीं है, तो इसे जोड़ें:
> ```sh
> echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
> ```
> स्टेटस लाइन स्वयं एक एब्सोल्यूट पाथ का उपयोग करती है, इसलिए यह आपके `PATH` की परवाह किए बिना काम करती है।

<a id="usage-insights"></a>
## उपयोग अंतर्दृष्टि

ccbar कोई **नेटवर्क कॉल नहीं करता** और इसके पास **कोई क्रेडेंशियल नहीं है** — यह केवल उस JSON को देखता है जिसे Claude Code `ccbar render` को पाइप करता है। उस डेटा को स्टेटस लाइन के बाहर उपयोगी बनाने के लिए, `render` सबसे हालिया पेलोड को कैश करता है (और एक छोटा रोलिंग इतिहास रिकॉर्ड करता है), जिसे दो कमांड वापस पढ़ते हैं। इन्हें `ccbar demo stats` और `ccbar demo history` के माध्यम से नमूना डेटा के साथ आज़माएँ।

### `ccbar stats`

एक विस्तृत, ऑन-डिमांड उपयोग पैनल — मॉडल, सेशन (5h), साप्ताहिक (7d), कॉन्टेक्स्ट, कॉस्ट, रीसेट काउंटडाउन, और आपकी वर्तमान गति:

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

यह उस सबसे हालिया पेलोड को पढ़ता है जिसे Claude Code ने `ccbar render` को सौंपा था (हर रीड्रॉ पर कैप्चर किया गया और इस मुहर के साथ कि कितनी देर पहले)। इसे ओवरराइड करने के लिए ताज़ा JSON पाइप करें — `… | ccbar stats`।

### `ccbar history`

पिछले 7 दिनों में उपयोग के रुझान — दैनिक 5-घंटे के शिखरों की एक स्पार्कलाइन, वर्तमान साप्ताहिक उपयोग, एक प्रति-दिन तालिका (शिखर 5h/7d %, अनुमानित कॉस्ट), और आपकी मापी गई बर्न रेट:

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

`render` `${XDG_STATE_HOME:-~/.local/state}/ccbar/history.tsv` पर एक थ्रॉटल्ड स्नैपशॉट (अधिकतम एक प्रति मिनट) रिकॉर्ड करता है, और `history` उसका सारांश देता है। यह केवल उस समय को दर्शाता है जब Claude Code खुला था, और दैनिक कॉस्ट एक अनुमान है (प्रति-सेशन जोड़ा गया)। रिकॉर्डिंग को पूरी तरह अक्षम करने के लिए `CCBAR_HISTORY=0` सेट करें; रीसेट करने के लिए फ़ाइल को डिलीट करें।

## यह कैसे काम करता है

Claude Code [कस्टम स्टेटस लाइन्स](https://docs.claude.com/en/docs/claude-code/statusline) का समर्थन करता है: यह एक कमांड चलाता है और एक JSON ऑब्जेक्ट (मॉडल, वर्कस्पेस, कॉन्टेक्स्ट विंडो, रेट लिमिट्स) को उसके stdin पर पाइप करता है, फिर कमांड जो भी प्रिंट करती है उसे प्रदर्शित करता है। `ccbar` उस JSON को `jq` के साथ पढ़ता है और दो-पंक्ति वाला बार रेंडर करता है।

इंस्टॉलर इसे `~/.claude/settings.json` में जोड़ता है (मर्ज करते हुए, आपकी अन्य सेटिंग्स को कभी बदले बिना):

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
## मैनुअल इंस्टॉल

```sh
# 1. स्क्रिप्ट डाउनलोड करें
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/lakpriya1s/ccbar/main/bin/ccbar -o ~/.local/bin/ccbar
chmod +x ~/.local/bin/ccbar

# 2. इसे कॉन्फ़िगर करें
~/.local/bin/ccbar config

# 3. Claude Code को इसकी ओर इंगित करें (~/.claude/settings.json में जोड़ें)
#    "statusLine": { "type": "command", "command": "~/.local/bin/ccbar render", "padding": 0 }
```

## अनइंस्टॉल करें

```sh
ccbar uninstall
```

`~/.claude/settings.json` से `statusLine` एंट्री हटा देता है (एक `.bak` बैकअप के साथ) और वैकल्पिक रूप से बाइनरी और कॉन्फ़िग को डिलीट कर देता है।

## समस्या निवारण

- **स्टेटस लाइन दिखाई नहीं देती** — एक *नया* Claude Code सेशन शुरू करें; स्टेटस लाइन सेशन की शुरुआत में लोड होती है।
- **`jq not found`** — `jq` इंस्टॉल करें ([आवश्यकताएँ](#requirements) देखें)।
- **बार में टूटे हुए वर्ण** — आपके टर्मिनल फ़ॉन्ट में ब्लॉक ग्लिफ़ नहीं हो सकते; `ccbar config` चलाएँ और `=-` ascii बार स्टाइल चुनें।

## योगदान करें

इश्यूज़ और PRs का स्वागत है। `ccbar` बिना किसी बिल्ड स्टेप के एक एकल पोर्टेबल bash स्क्रिप्ट (`bin/ccbar`) है — इसे संपादित करें, फिर पूर्वावलोकन के लिए `bin/ccbar demo` चलाएँ।

## लाइसेंस

[MIT](../LICENSE) © Lakpriya Senevirathna
