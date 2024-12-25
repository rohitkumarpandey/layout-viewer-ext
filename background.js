importScripts('storage.js');
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    if (request.action === 'open_popup') {
        chrome.action.openPopup();
    }

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