document.addEventListener('DOMContentLoaded', () => {
    const pageIframe = document.getElementsByClassName('mbe-page-iframe');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (pageIframe) {
            [...pageIframe].forEach(frame => {
                frame.src = activeTab.url;
            })
        }
    })
})