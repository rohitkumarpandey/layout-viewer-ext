importScripts('storage.js');
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'extensionIconClicked' }, (_) => {
        if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError);
        }
    });
});

chrome.runtime.onMessage.addListener((request, _, callback) => {
    if (request.action === 'session_storage') {
        if (request.perform && request.perform == 'GET') {
            get(request.data.key, (result) => {
                callback(result);
            });
        } else if (request.perform && request.perform == 'SET') {
            set(request.data, (result) => {
                callback(result);
            });
        }
        return true;
    }
    if (request.action === 'getCurrentTabUrl') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            callback({ url: tabs[0].url });
        });
        return true;
    }
})