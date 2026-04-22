class AppConfig {
    constructor(showFloatingBtn = true, activeTabUrl = null, fullscreen = false, pinned = true) {
        this.showFloatingBtn = showFloatingBtn;
        this.activeTabUrl = activeTabUrl;
        this.fullscreen = fullscreen;
        this.pinned = pinned;
    }
    getShowFloatingBtn() {
        return this.showFloatingBtn;
    }
    setShowFloatingBtn(showFloatingBtn) {
        this.showFloatingBtn = showFloatingBtn;
    }
    getActiveTabUrl() {
        return this.activeTabUrl;
    }
    setActiveTabUrl(activeTabUrl) {
        this.activeTabUrl = activeTabUrl;
    }
    getFullscreen() {
        return this.fullscreen;
    }
    setFullscreen(fullscreen) {
        this.fullscreen = fullscreen;
    }
    getPinned() {
        return this.pinned;
    }
    setPinned(pinned) {
        this.pinned = pinned;
    }
}
// Function to dynamically load a font from a CDN
function loadFont(fontUrl) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = fontUrl;
    document.head.appendChild(fontLink);
}
(() => {
    const font = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap';
    loadFont(font);
    const appConfig = new AppConfig();
    const brandName = 'Layout Viewer';
    const showPopupBtn = document.createElement('div');
    const hideFLoatingBtn = document.createElement('div');
    const extensionTagName = 'layout-viewer-extension';
    const CONSTANT = {
        POPUP_ID: 'custom-popup',
        ACTION: {
            SESSION_STORAGE: 'session_storage',
        },
        SESSION_STORAGE: {
            POPUP_PINNED: 'popup_pinned',
        }
    };
    const brandColor = '#1D366F';
    const layout_viewer = document.createElement(extensionTagName);
    const button = document.createElement("div");
    const closeBtn = document.createElement('div');
    const toggleBtn = document.createElement('div');
    const styleConfig = {
        button: {
            position: 'fixed',
            top: '50%',
            right: 0,
            zIndex: '2000',
            padding: '4px',
            border: 'none',
            cursor: 'pointer',
            'height': '150px',
            'border-radius': '5px 0 5px 0',
            'writing-mode': 'tb-rl',
            transform: 'translate(0, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            color: `${brandColor}`,
            'font-weight': 'bolder',
            'font-family': `"Montserrat", serif`,
            'font-size': '12px',
            'letter-spacing': '1px',
            backgroundColor: 'white',
            boxShadow: `1px 1px 5px 0 ${brandColor}`,
        },
        popup: {
            position: 'fixed',
            top: '2%',
            right: '0',
            'width': '60%',
            height: '92%',
            display: 'block',
            zIndex: '20000',
            'border-radius': '5px 0 0 5px',
            boxShadow: '1px 1px 5px 0 lightslategrey',
            backgroundColor: 'white',
            'font-family': `"Montserrat", serif`,
        },
        popupOptions: {
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            fontSize: '24px',
            color: 'black',
            fontWeight: 'normal',
            'font-family': `"Montserrat", serif`,
        },
        popupClose: {
            cursor: 'pointer',
            margin: '0 4px',
            'font-family': `"Montserrat", serif`,
        },
        toggleBtn: {
            cursor: 'pointer',
            color: 'black',
            margin: '0 4px',
            'font-family': `"Montserrat", serif`,
        },

        iframe: {
            width: '100%',
            height: '100%',
            border: 'none',
            'border-radius': '5px 0 0 5px',
        },
        hoveringOpts: {
            position: 'absolute',
            top: '0',
            backgroundColor: 'white',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            'border-radius': '5px 0 5px 0'
        },
        hovering_hide: {
            display: 'none'
        },
        hovering_show: {
            display: 'flex'
        },
        popupShow: {
            display: 'flex',
            width: '95%',
            alignItems: 'center',
            flexBasis: '80%',
            justifyContent: 'center',
            borderBottom: '0.5px solid lightslategrey',
        },

        floatBtnHide: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '95%',
            flexBasis: '20%',
            fontSize: '16px',
            color: 'red',
            backgroundColor: '#f5f1fe'
        }
    };
    function hoveringOptions() {
        const hoveringOptions = document.createElement('div');
        hoveringOptions.id = 'layout_viewer_btn_hover'

        showPopupBtn.id = "popup_show_btn";
        Object.assign(showPopupBtn.style, styleConfig.popupShow);
        showPopupBtn.innerText = 'View Layout';
        hoveringOptions.appendChild(showPopupBtn);

        hideFLoatingBtn.id = "popup_close_btn";
        hideFLoatingBtn.innerText = 'X';
        Object.assign(hideFLoatingBtn.style, styleConfig.floatBtnHide);

        hoveringOptions.appendChild(hideFLoatingBtn);
        Object.assign(hoveringOptions.style, styleConfig.hoveringOpts);
        Object.assign(hoveringOptions.style, styleConfig.hovering_hide);
        return hoveringOptions;
    }
    function extensionTagElem() {
        return document.getElementsByTagName(extensionTagName);
    }
    // inject floating button
    function injectingFloatingButton() {
        const extensionTag = [...extensionTagElem()];
        if (!extensionTag.length) {
            const logo = document.createElement('img');
            logo.src = chrome.runtime.getURL('assets/logo.webp');
            logo.style.width = '24px';
            logo.style.height = '24px';
            button.id = 'layout_viewer_floating_button';
            button.appendChild(logo);
            const name = document.createElement('span');
            name.innerText = `${brandName}`;
            button.appendChild(name);
            Object.assign(button.style, styleConfig.button);
            button.appendChild(hoveringOptions());
            layout_viewer.appendChild(button);
            document.body.appendChild(layout_viewer);
            appConfig.setShowFloatingBtn(true);
            saveState(appConfig);
        }
    }

    function removeFlotingButton() {
        const layoutViewer = document.getElementsByTagName(extensionTagName);
        if (layoutViewer) {
            [...layoutViewer].forEach(lv => {
                lv.parentNode.removeChild(lv);
            });

            appConfig.setShowFloatingBtn(false);
            saveState(appConfig);
        }
    }

    function closePopup() {
        closeBtn.innerHTML = '&#x2716;'
        closeBtn.id = "close-popup-btn";
        Object.assign(closeBtn.style, styleConfig.popupClose);
        return closeBtn;
    }
    function toggleFullScreenOption() {
        toggleBtn.innerHTML = '&#x26F6;'
        toggleBtn.id = "toggle-fullscreen-btn";
        Object.assign(toggleBtn.style, styleConfig.toggleBtn);
        return toggleBtn;
    }
    function popupOptions() {
        const options = document.createElement('div');
        options.id = 'popup-options';
        Object.assign(options.style, styleConfig.popupOptions);
        options.appendChild(closePopup());
        options.appendChild(toggleFullScreenOption());
        return options;
    }
    function injectPopup() {
        const popupElem = document.getElementById('custom-popup');
        const extensionTag = [...extensionTagElem()];
        if (!(extensionTag.length && popupElem)) {
            const popup = document.createElement('div');
            popup.id = 'custom-popup';
            Object.assign(popup.style, styleConfig.popup);
            popup.appendChild(popupOptions());
            const iframe = document.createElement('iframe');
            iframe.src = chrome.runtime.getURL('popup.html');
            Object.assign(iframe.style, styleConfig.iframe);
            popup.appendChild(iframe);
            const layout_viewer = document.getElementsByTagName(extensionTagName);
            layout_viewer[0].appendChild(popup);
            appConfig.setPinned(true);

            // update current tab url
            (async () => {
                const url = await getCurrentTabUrl();
                appConfig.setActiveTabUrl(url);
                saveState(appConfig);
            })();
        }
    }
    function bindEvent(target, event, callback) {
        target.addEventListener(event, callback);
    }
    function stretchToFullScreen() {
        const popup = document.getElementById('custom-popup');
        if (popup) {
            popup.style.width = '100%';
            popup.style.height = '100%';
            popup.style.top = '0';
        }
    }
    function shrinkToMedium() {
        const popup = document.getElementById('custom-popup');
        if (popup) {
            popup.style.width = '60%'
            popup.style.height = '92%';
            popup.style.top = '2%';
        }
    }
    function toggleFullScreen() {
        const popup = document.getElementById('custom-popup');
        if (popup && popup.style.width.includes('100')) {
            shrinkToMedium();
            appConfig.setFullscreen(false);
        } else {
            stretchToFullScreen();
            appConfig.setFullscreen(true);
        }
        saveState(appConfig);
    }

    function bindEvents() {
        bindEvent(showPopupBtn, 'click', () => {
            const popup = document.getElementById('custom-popup');
            if (!popup) {
                injectPopup();
            }
        });
        bindEvent(hideFLoatingBtn, 'click', () => {
            removeFlotingButton();
        });
        bindEvent(button, 'mouseenter', () => {
            const a = document.getElementById('layout_viewer_btn_hover');
            Object.assign(a.style, styleConfig.hovering_show);
        });
        bindEvent(button, 'mouseleave', () => {
            const a = document.getElementById('layout_viewer_btn_hover');
            Object.assign(a.style, styleConfig.hovering_hide);
        });
        bindEvent(toggleBtn, 'click', () => {
            toggleFullScreen();
        });

        bindEvent(closeBtn, 'click', () => {
            const popup = document.getElementById('custom-popup');
            if (popup) {
                popup.remove();
                appConfig.setActiveTabUrl(null);
                appConfig.setFullscreen(false);
                appConfig.setPinned(false);
                saveState(appConfig);
            }
        });
    }

    function sendMessageToBackground(message, callback) {
        chrome.runtime.sendMessage(message, {}, callback);
    }

    function saveState(config) {
        sendMessageToBackground({ action: CONSTANT.ACTION.SESSION_STORAGE, perform: 'SET', data: { 'appconfig': config } }, () => { });
    }
    async function getState() {
        return await new Promise((resolve) => {
            sendMessageToBackground({ action: CONSTANT.ACTION.SESSION_STORAGE, perform: 'GET', data: { key: 'appconfig' } }, (response) => {
                resolve(response);
            });
        });
    }
    async function getCurrentTabUrl() {
        return new Promise((resolve, reject) => {
            sendMessageToBackground({ action: 'getCurrentTabUrl' }, (response) => {
                if (chrome.runtime.lastError) {
                    reject('');
                } else {
                    resolve(new URL(response.url).origin);
                }
            });
        });
    }
    function loadData() {
        (async () => {
            const url = await getCurrentTabUrl();
            const config = (await getState())['appconfig'] || appConfig;
            appConfig.setShowFloatingBtn(config.showFloatingBtn);
            if (appConfig.getShowFloatingBtn()) {
                injectingFloatingButton();
            }
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
                if (config.activeTabUrl === url) {
                    appConfig.setActiveTabUrl(url);
                    appConfig.setFullscreen(config.fullscreen);
                    appConfig.setPinned(config.pinned);

                    // open popup if pinned
                    if (appConfig.pinned) {
                        injectPopup();
                    }
                    // open in fullscreen
                    if (appConfig.fullscreen) {
                        stretchToFullScreen();
                    }
                }
            }
        })();

    }
    loadData();
    bindEvents();
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'extensionIconClicked') {
            injectingFloatingButton();
            injectPopup();
            sendResponse({ status: 'success' });
        }
    });
})();

