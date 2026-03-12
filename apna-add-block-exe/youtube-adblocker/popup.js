const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

toggle.addEventListener("change", () => {

    const enabled = toggle.checked;

    chrome.storage.local.set({
        adblock: enabled
    });

    status.innerText = enabled ? "ON" : "OFF";
});