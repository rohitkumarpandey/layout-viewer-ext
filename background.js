importScripts('storage.js');
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    if (request.action === 'open_popup') {
        chrome.action.openPopup();
    }

    if (request.action === 'session_storage') {
        if (request.perform && request.perform == 'GET') {
            get(request?.data?.key, (result) => {
                callback({'popup_pinned': result });
            });
        } else if (request.perform && request.perform == 'SET') {
            set(request?.data?.key, request?.data?.value, (result) => {
                callback(result);
            });
        }
    }
})