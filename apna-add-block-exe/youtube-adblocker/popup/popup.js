const toggle = document.getElementById("toggle");
const status = document.getElementById("status");
const count = document.getElementById("count");
const settingsBtn = document.getElementById("settingsBtn");

chrome.storage.local.get(["enabled","adsBlocked"],(data)=>{

toggle.checked = data.enabled;

status.innerText = data.enabled ? "Ad Blocker Enabled" : "Ad Blocker Disabled";

count.innerText = data.adsBlocked || 0;

});

toggle.addEventListener("change",()=>{

const enabled = toggle.checked;

chrome.storage.local.set({enabled});

status.innerText = enabled ? "Ad Blocker Enabled" : "Ad Blocker Disabled";

});

settingsBtn.addEventListener("click",()=>{

chrome.runtime.openOptionsPage();

});