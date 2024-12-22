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
})