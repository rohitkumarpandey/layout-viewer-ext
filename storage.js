// Description: This file contains the storage functions.

function get(key, callback) {
    chrome.storage.local.get([key], function (result) {
        callback(result);
    });
}

function set(data, callback) {
    chrome.storage.local.set(data , function (result) {
        callback(result);
    });
}