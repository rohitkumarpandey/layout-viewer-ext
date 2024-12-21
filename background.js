chrome.runtime.onMessage.addListener((request) => {
    if(request.action === 'open_popup') {
        chrome.action.openPopup();
    }
})