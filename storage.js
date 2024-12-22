// Description: This file contains the storage functions.

function get(key, callback) {
    chrome.storage.session.get([key], function (result) {
        callback(result);
    });
}

function set(key, value, callback) {
    console.log('key', key, value);
    const a = {key: value};
    chrome.storage.local.set({ a }, function (result) {
        console.log('result', result);
        callback(result);
    });
}