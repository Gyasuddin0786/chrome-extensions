let adsBlocked = 0;

chrome.runtime.onInstalled.addListener(() => {

chrome.storage.local.set({
enabled:true,
adsBlocked:0,
whitelist:[]
});

});

chrome.runtime.onMessage.addListener((msg)=>{

if(msg.type === "AD_BLOCKED"){

chrome.storage.local.get(["adsBlocked"],(data)=>{

let total = data.adsBlocked || 0;

total++;

chrome.storage.local.set({
adsBlocked: total
});

});

}

});