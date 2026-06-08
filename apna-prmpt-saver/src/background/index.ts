chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') })
  }

  chrome.contextMenus.create({
    id: 'save-prompt',
    title: 'Save as Prompt — Apna PromptVault',
    contexts: ['selection'],
  })
  chrome.contextMenus.create({
    id: 'open-dashboard',
    title: 'Open Apna PromptVault Dashboard',
    contexts: ['all'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-dashboard') {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') })
    return
  }
  if (info.menuItemId === 'save-prompt' && info.selectionText && tab?.id) {
    chrome.storage.session.set({
      pendingPrompt: {
        text: info.selectionText,
        url: tab.url ?? '',
        title: tab.title ?? '',
      },
    })
    chrome.action.openPopup()
  }
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-promptvault') chrome.action.openPopup()
  if (command === 'search-prompts') chrome.action.openPopup()
})
