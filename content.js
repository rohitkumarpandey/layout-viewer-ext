(() => {
    const CONSTANT = {
        POPUP_ID: 'custom-popup',
        ACTION: {
            SESSION_STORAGE: 'session_storage',
        },
        SESSION_STORAGE: {
            POPUP_PINNED: 'popup_pinned',
        },
        SENDER: {
            BACKGROUND: 'background',
            CONTENT: 'content',
            POPUP: 'popup'
        }
    };
    const button = document.createElement("button");
    const closeBtn = document.createElement('div');
    const pinBtn = document.createElement('div');
    const toggleBtn = document.createElement('div');
    const styleConfig = {
        button: {
            position: 'fixed',
            top: '50%',
            right: 0,
            zIndex: '2000',
            padding: '10px',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            "box-shadow": '2px 2px 5px grey',
            width: '40px',
            height: '200px',
            'border-radius': '10px 0',
            'writing-mode': 'tb-rl',
            transform: 'translate(0, -50%)'
        },
        popup: {
            position: 'fixed',
            top: '2%',
            right: '0',
            'width': '60%',
            height: '92%',
            display: 'block',
            zIndex: '2000',
            'border-radius': '5px 0 0 5px',
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
            fontWeight: 'normal'
        },
        popupClose: {
            cursor: 'pointer',
            margin: '0 4px',
        },
        popupPin: {
            cursor: 'pointer',
            margin: '-2px 4px 0 4px',
            rotate: '150deg'
        },
        toggleBtn: {
            cursor: 'pointer',
            color: 'black',
            margin: '0 4px',
        },

        iframe: {
            width: '100%',
            height: '100%',
            border: 'none',
            'border-radius': '5px 0 0 5px',
        }
    };


    // inject floating button
    function injectingFloatingButton() {
        button.innerText = 'Layout Viewer';
        Object.assign(button.style, styleConfig.button);
        document.body.appendChild(button);
    }

    function pinPopupOption() {
        pinBtn.innerHTML = '&#9740;'
        pinBtn.id = "pin-popup-btn";
        Object.assign(pinBtn.style, styleConfig.popupPin);
        return pinBtn;
    }

    function closePopup() {
        closeBtn.innerHTML = '&#x2716;'
        closeBtn.id = "close-popup-btn";
        Object.assign(closeBtn.style, styleConfig.popupClose);
        return closeBtn;
    }
    function toggleFullScreen() {
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
        //options.appendChild(pinPopupOption());
        options.appendChild(toggleFullScreen());
        return options;
    }
    function injectPopup() {
        const popup = document.createElement('div');
        popup.id = 'custom-popup';
        Object.assign(popup.style, styleConfig.popup);
        popup.appendChild(popupOptions());
        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL('popup.html');
        Object.assign(iframe.style, styleConfig.iframe);
        popup.appendChild(iframe);

        document.body.appendChild(popup);
    }
    function bindEvent(target, event, callback) {
        target.addEventListener(event, callback);
    }
    function bindEvents() {
        bindEvent(button, 'click', () => {
            const popup = document.getElementById('custom-popup');
            if (!popup) {
                injectPopup();
            }
        });

        bindEvent(toggleBtn, 'click', () => {
            const popup = document.getElementById('custom-popup');

            if (popup && popup.style.width.includes('100')) {
                popup.style.width = '60%'
                popup.style.height = '92%';
                popup.style.top = '2%';

            } else {
                popup.style.width = '100%';
                popup.style.height = '100%';
                popup.style.top = '0';
            }
        });

        bindEvent(closeBtn, 'click', () => {
            const popup = document.getElementById('custom-popup');

            if (popup) {
                popup.remove();
            }
        });

        bindEvent(pinBtn, 'click', () => {
            togglePinPopup();
        });
    }
    function togglePinPopup() {
        // check if popup is pinned
        const isPinned = checkForPinPopUp();
        sendMessageToBackground({ action: CONSTANT.ACTION.SESSION_STORAGE, perform: 'SET', data: { key: CONSTANT.SESSION_STORAGE.POPUP_PINNED, value: !isPinned } }, () => { });

    }
    function pinPopup() {
        // check if popup is pinned
        if (checkForPinPopUp()) {
            injectPopup();
        }
    }

    function sendMessageToBackground(message, callback) {
        chrome.runtime.sendMessage(message, callback);
    }
    function checkForPinPopUp() {
        let isPinned = false;
        sendMessageToBackground({ action: CONSTANT.ACTION.SESSION_STORAGE, perform: 'GET', data: { key: CONSTANT.SESSION_STORAGE.POPUP_PINNED } }, (response) => {
            console.log('Message sent', response);
            isPinned = response && response[CONSTANT.SESSION_STORAGE.POPUP_PINNED];
        });
        return isPinned;
    }
    function handleReload() {
        const popup = document.getElementById('custom-popup');
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
            if (!popup) {
                injectPopup();
            }
        }
    }
    injectingFloatingButton();
    bindEvents();
    handleReload();

})();