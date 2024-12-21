(() => {
    const button = document.createElement("button");
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
        toggleBtn: {
            position: 'absolute',
            top: '15px',
            left: '15px',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'black'
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

    function injectPopup() {
        const popup = document.createElement('div');
        popup.id = 'custom-popup';
        Object.assign(popup.style, styleConfig.popup);

        const toggleBtn = document.createElement('div');
        toggleBtn.innerHTML = '&#x26F6;'
        toggleBtn.id = "toggle-fullscreen-btn";
        Object.assign(toggleBtn.style, styleConfig.toggleBtn);
        popup.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
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
        })

        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL('popup.html');
        Object.assign(iframe.style, styleConfig.iframe);
        popup.appendChild(iframe);

        document.body.appendChild(popup);
    }

    function bindEvents() {
        button.addEventListener('click', () => {
            const popup = document.getElementById('custom-popup');

            if (!popup) {
                injectPopup();
            }
        })
    }

    injectingFloatingButton();
    bindEvents();

})();