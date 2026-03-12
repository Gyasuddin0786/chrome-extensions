function removeAds() {

    // Skip button
    const skipBtn = document.querySelector(".ytp-ad-skip-button");

    if (skipBtn) {
        skipBtn.click();
        console.log("Ad skipped");
    }

    // Remove video ads overlay
    const adOverlay = document.querySelector(".ytp-ad-overlay-container");

    if (adOverlay) {
        adOverlay.remove();
        console.log("Overlay removed");
    }

    // Remove ad video player
    const adPlayer = document.querySelector(".ad-showing");

    if (adPlayer) {
        const video = document.querySelector("video");

        if (video) {
            video.currentTime = video.duration;
        }
    }
}

setInterval(removeAds, 500);