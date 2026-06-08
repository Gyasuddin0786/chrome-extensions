# ⚡ PromptVault AI

A production-ready Chrome Extension for AI prompt management — built with **React + Vite + TypeScript + Tailwind CSS + Chrome Manifest V3**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Development build (watch mode)
npm run dev

# 3. Production build
npm run build
```

---

## 🔌 Load in Chrome

1. Run `npm run build`
2. Open Chrome → `chrome://extensions`
3. Enable **Developer Mode** (top right)
4. Click **Load unpacked**
5. Select the `dist/` folder
6. Pin the extension — click **⚡** in toolbar

---

## 📁 Project Structure

```
apna-prmpt-saver/
├── src/
│   ├── popup/          # Extension popup (420×560px quick panel)
│   ├── dashboard/      # Full-page prompt manager
│   ├── options/        # Settings page
│   ├── welcome/        # First-run onboarding
│   ├── background/     # Service worker (context menus, commands)
│   ├── content/        # Floating widget on AI chat pages
│   ├── components/
│   │   ├── ui/         # Button, Input, Modal, Badge, Tooltip, Skeleton
│   │   ├── prompts/    # PromptCard, PromptForm, PromptGrid
│   │   ├── folders/    # FolderList, FolderForm
│   │   ├── layout/     # Sidebar, SearchBar
│   │   └── analytics/  # Charts, StatCards
│   ├── hooks/          # useSearch, useStats, useTheme
│   ├── services/       # StorageService (Chrome Storage API)
│   ├── store/          # React Context + useReducer state
│   ├── types/          # TypeScript interfaces
│   └── utils/          # cn, formatDate, copyToClipboard, export helpers
├── assets/icons/       # Extension icons (PNG)
├── manifest.json       # Chrome MV3 manifest
└── dist/               # Production build output (load this in Chrome)
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Prompt CRUD** | Create, edit, delete, duplicate, archive, restore |
| **One-Click Copy** | Copy prompt + auto-increment usage counter |
| **Instant Search** | Fuzzy search (Fuse.js) by title, content, tags, category |
| **Folders** | Colored folders with nested support |
| **Favorites** | Star/unstar prompts |
| **Tags** | Add/remove inline tags, filter by tag |
| **AI Model Labels** | ChatGPT, Claude, Gemini, Cursor, Perplexity, DeepSeek, Grok |
| **Analytics** | Bar + pie charts, stat cards, most used, recently used |
| **Import/Export** | JSON, CSV, Markdown |
| **Backup** | Manual download backup |
| **Theme** | Dark / Light / System |
| **Floating Widget** | Injected on ChatGPT, Claude, Gemini, Perplexity |
| **Context Menu** | Right-click → Save as Prompt |
| **Keyboard Shortcuts** | `Ctrl+Shift+P`, `Ctrl+Shift+S`, `Ctrl+Shift+F` |
| **Settings Page** | Appearance, categories, shortcuts, storage, about |
| **Welcome Onboarding** | 3-step first-run page |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+P` | Open PromptVault popup |
| `Ctrl+Shift+S` | Save selected text as prompt |
| `Ctrl+Shift+F` | Search prompts |

---

## 🧱 Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool
- **TypeScript** — Type safety
- **Tailwind CSS 3** — Utility-first styles
- **@crxjs/vite-plugin** — Chrome extension bundling
- **Fuse.js** — Fuzzy search
- **Recharts** — Analytics charts
- **react-hot-toast** — Toast notifications
- **lucide-react** — Icons
- **uuid** — Prompt ID generation
- **Chrome Storage API** — Persistent local storage

---

## 🎨 Replacing Icons

The `assets/icons/` folder contains placeholder PNGs. Replace them with proper icons:

```
assets/icons/icon16.png   (16×16)
assets/icons/icon32.png   (32×32)
assets/icons/icon48.png   (48×48)
assets/icons/icon128.png  (128×128)
```

Run `node scripts/generate-icons.js` to regenerate SVG source files.

---

## 📦 Build Output

After `npm run build`, the `dist/` folder contains the complete unpacked extension ready to load in Chrome.
