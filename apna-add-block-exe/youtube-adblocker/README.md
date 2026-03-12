# 🚫 Apna YouTube Ad Blocker Pro

A modern Chrome extension that blocks YouTube ads, skips video ads automatically, and removes promoted content from the YouTube interface.

This extension is built using **Chrome Manifest V3** and provides a clean UI with settings, statistics, and domain whitelisting.

---

## ✨ Features

### 🎥 YouTube Ad Blocking

* Auto skip **YouTube video ads**
* Remove **overlay ads**
* Remove **homepage promoted videos**
* Detect ads dynamically using **MutationObserver**
* Skip ads by jumping to the end of ad playback

### ⚙ Extension Controls

* Enable / Disable Ad Blocker toggle
* Ads blocked **counter**
* **Settings page** for configuration
* **Domain whitelist support**

### 🎨 Modern UI

* Dark themed popup UI
* Clean settings dashboard
* Professional extension layout

### ⚡ Performance

* Lightweight and fast
* Uses **Chrome Manifest V3**
* Runs only on YouTube pages

---

## 📁 Project Structure

```
youtube-adblocker-pro
│
├── manifest.json
├── background.js
│
├── content
│   └── adblock.js
│
├── popup
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
│
├── settings
│   ├── settings.html
│   ├── settings.js
│   └── settings.css
│
├── utils
│   └── storage.js
│
└── icons
```

---

## 🚀 Installation (Developer Mode)

1. Open **Google Chrome**
2. Go to:

```
chrome://extensions
```

3. Enable **Developer Mode** (top right)
4. Click **Load Unpacked**
5. Select the project folder:

```
youtube-adblocker-pro
```

The extension will now appear in your Chrome toolbar.

---

## 🧪 How It Works

The extension detects ads using:

* DOM selectors
* MutationObserver
* YouTube player state

When an ad is detected it:

1. Clicks the **Skip Ad button**
2. Removes **overlay advertisements**
3. Removes **promoted homepage content**
4. Skips ad playback by setting the video time to the end

---

## ⚙ Settings

The settings page allows you to:

* Add domains to the **whitelist**
* Allow ads on selected websites
* Manage blocked domains list

Example whitelist:

```
youtube.com
example.com
```

Ads will **not be blocked on these domains**.

---

## 📊 Statistics

The popup dashboard displays:

* Total **Ads Blocked**
* Ad blocker status (ON/OFF)

---

## 🔒 Privacy

This extension:

* Does **not collect user data**
* Does **not track browsing activity**
* Works entirely **locally in your browser**

---

## ⚠ Limitations

YouTube actively updates its **anti-adblock detection system**.
This extension may require updates when YouTube changes its ad delivery mechanism.

---

## 🛠 Technologies Used

* JavaScript
* Chrome Extensions API
* Manifest V3
* MutationObserver

---

## 📌 Future Improvements

Planned upgrades include:

* YouTube Shorts ad blocking
* Sidebar ad removal
* Network-level ad blocking
* Sponsor segment skipping
* Better anti-adblock bypass
* Advanced analytics dashboard

---

## 👨‍💻 Author

Developed by **Gyasuddin Ansari**

Computer Engineering 
MERN Stack Developer

---

## ⭐ Support

If you find this project useful, consider giving it a **star on GitHub** ⭐
