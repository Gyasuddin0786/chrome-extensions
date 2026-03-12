function notifyAdBlocked() {
  chrome.runtime.sendMessage({ type: "AD_BLOCKED" });
}

function removeAds() {
  // Skip button
  const skipBtn = document.querySelector(".ytp-ad-skip-button");

  if (skipBtn) {
    skipBtn.click();
    notifyAdBlocked();
  }

  // Overlay ads
  const overlay = document.querySelector(".ytp-ad-overlay-container");

  if (overlay) {
    overlay.remove();
    notifyAdBlocked();
  }

  // Detect ad video playing
  const adShowing = document.querySelector(".ad-showing");

  if (adShowing) {
    const video = document.querySelector("video");

    if (video) {
      const duration = video.duration;

      if (
        typeof duration === "number" &&
        !isNaN(duration) &&
        isFinite(duration) &&
        duration > 1
      ) {
        try {
          video.currentTime = duration - 0.1;
          notifyAdBlocked();
        } catch (err) {
          console.log("Skip failed", err);
        }
      }
    }
  }

  // Remove homepage promoted ads
  const promoted = document.querySelectorAll("ytd-promoted-video-renderer");

  promoted.forEach((ad) => {
    ad.remove();
    notifyAdBlocked();
  });
}

// Remove YouTube anti-adblock popup
function removeAdblockPopup() {
  const popup = document.querySelector("ytd-enforcement-message-view-model");

  if (popup) {
    popup.remove();
  }
}

// Observe DOM changes (ads often injected dynamically)
const observer = new MutationObserver(() => {
  removeAds();
  removeAdblockPopup();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Backup interval check
setInterval(removeAds, 2000);
setInterval(removeAdblockPopup, 2000);
