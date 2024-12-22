class DeviceOption {
    constructor(id, name, height, width, enabled = true) {
        this.id = id;
        this.name = name;
        this.height = height;
        this.width = width;
        this.enabled = enabled;
    }
    getPortraitMode() {
        return { name: this.name, height: this.height, width: this.width };
    }

    getLandScapeMode() {
        return { name: this.name, height: this.width, width: this.height };
    }
}

class AppManager {
    constructor(deviceOptions, tabs = 1) {
        this.deviceOptions = deviceOptions;
        this.tabs = tabs
    }

    setDeviceOptions(sectionNum) {
        const pageHeadersElem = document.getElementsByClassName('lv-page-header');
        const pageHeaderLeft = document.createElement('div');
        pageHeaderLeft.className = 'lv-page-header-left';
        // pageHeaderLeft.innerHTML = '&#128241;';

        const pageHeaderMiddle = document.createElement('div');
        pageHeaderMiddle.className = 'lv-page-header-middle';

        const pageHeaderRight = document.createElement('div');
        pageHeaderRight.className = 'lv-page-header-right';

        const rotateIcon = document.createElement('img');
        rotateIcon.id = `rotate-device-${sectionNum}`;
        rotateIcon.src = './assets/rotate-device.png'

        const resolution = document.createElement('div');
        resolution.id = `lv-page-resolution-${sectionNum}`;
        resolution.className = 'lv-page-resolution'
        const defaultDevice = this.deviceOptions[0];
        resolution.innerText = `${defaultDevice.width} x ${defaultDevice.height}`;

        const closeTabBtn = document.createElement('div');
        closeTabBtn.innerHTML = '&#x2715;';
        closeTabBtn.className = 'close-tab-btn';
        closeTabBtn.setAttribute('data-app', `close-tab-btn-${sectionNum}`);

        const deviceOptionsDropdown = document.createElement('select');
        deviceOptionsDropdown.className = 'lv-device-dropdown';
        deviceOptionsDropdown.setAttribute('data-app', `section-dropdown-${sectionNum}`);
        this.deviceOptions.forEach(device => {
            if (device.enabled) {
                const optionElem = document.createElement('option');
                optionElem.innerText = device.name;
                optionElem.value = device.id;
                optionElem.className = 'lv-device-option';
                optionElem.setAttribute('data-app', `section-options-${sectionNum}`);
                deviceOptionsDropdown.appendChild(optionElem);
            }
        });

        pageHeaderMiddle.appendChild(rotateIcon);
        pageHeaderMiddle.appendChild(deviceOptionsDropdown);
        pageHeaderMiddle.appendChild(resolution);
        pageHeaderRight.appendChild(closeTabBtn);
        [...pageHeadersElem].forEach(pageHeaderElem => {
            pageHeaderElem.appendChild(pageHeaderLeft);
            pageHeaderElem.appendChild(pageHeaderMiddle);
            pageHeaderElem.appendChild(pageHeaderRight);
        });

        // rotateIcon.addEventListener('click', () => {
        //     const data = ("" + rotateIcon.getAttribute('data-app'));
        //     const sectionNum = data[data.length - 1];
        //     this.changeDevice(deviceOptionsDropdown.value, sectionNum);
        // });
        deviceOptionsDropdown.addEventListener('change', () => {
            const data = ("" + deviceOptionsDropdown.getAttribute('data-app'));
            const sectionNum = data[data.length - 1];
            this.changeDevice(deviceOptionsDropdown.value, sectionNum);
        });

        closeTabBtn.addEventListener('click', () => {
            const data = ("" + closeTabBtn.getAttribute('data-app'));
            const sectionNum = data[data.length - 1];

            const section = document.getElementById(`section-${sectionNum}`);
            if (section) {
                section.parentNode.removeChild(section);
            }
        });
    }

    setSection() {
        const sectionsRef = document.getElementsByClassName('lv-sections');

        const sectionElem = document.createElement('div');
        sectionElem.id = `section-${this.tabs}`;
        sectionElem.className = 'lv-section';

        const sectionHeaderElem = document.createElement('div');
        sectionHeaderElem.className = 'lv-page-header';

        const sectionContentElem = document.createElement('div');
        sectionContentElem.className = 'lv-section-tab';
        sectionContentElem.setAttribute('data-app', `tab-${this.tabs}`);

        const sectionContentIframeElem = document.createElement('iframe');
        sectionContentIframeElem.src = '/pages/page.html';
        sectionContentIframeElem.id = `iframe-${this.tabs}`;

        sectionContentElem.appendChild(sectionContentIframeElem);

        sectionElem.appendChild(sectionHeaderElem);
        sectionElem.appendChild(sectionContentElem);
        [...sectionsRef].forEach(section => section.appendChild(sectionElem));
        this.setDeviceOptions(this.tabs);



    }

    addTabs() {
        this.tabs++;
        this.setSection();
        this.setDefaultConfig();
    }

    changeDevice(deviceId, sectionId, orientation = 'portrait') {
        const iframe = document.getElementById(`iframe-${sectionId}`);
        const device = this.deviceOptions.find(device => device.id === deviceId);
        if (device) {
            let config;
            if (orientation === 'portrait') {
                config = device.getPortraitMode();
            } else {
                config = device.getLandScapeMode();
            }
            // update resolution text
            const resolution = document.getElementById(`lv-page-resolution-${sectionId}`);
            resolution.innerText = `${config.width} x ${config.height}`;
            iframe.style.height = config.height;
            iframe.style.width = config.width;
        }

    }

    setDefaultConfig() {
        const defaultDevice = this.deviceOptions[0];
        this.changeDevice(defaultDevice.id, this.tabs);
    }

    bindEvents() {
        // add tab btn
        const addTabBtn = document.getElementById('add-tab-btn');
        if (addTabBtn) {
            addTabBtn.addEventListener('click', () => {
                this.addTabs();
            })
        }

    }
    init() {
        this.setSection();
        this.setDefaultConfig();
        this.bindEvents();

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const iPhoneSE = new DeviceOption('iphone-se', 'iPhone SE', 667, 375);
    const iPhoneXR = new DeviceOption('iphone-xr', 'iPhone XR', 896, 414);
    const iPhone12Pro = new DeviceOption('iphone-12-pro', 'iPhone 12 Pro', 884, 390);
    const iPhone14MaxPro = new DeviceOption('iphone-14-pro-max', 'iPhone 14 Pro Max', 932, 430);
    const pixel7 = new DeviceOption('pixel-7', 'Pixel 7', 915, 412);
    const samsungGalaxyS8Plus = new DeviceOption('samsung-galaxy-s8-plus', 'Samsung Galaxy S8+', 740, 360);
    const samsungGalaxyS20Ultra = new DeviceOption('samsung-galaxy-s20-ultra', 'Samsung Galaxy S20 Ultra', 915, 412);
    const iPadMini = new DeviceOption('ipad-mini', 'iPad Mini', 1024, 768);
    const iPadAir = new DeviceOption('ipad-air', 'iPad Air', 1180, 820);
    const iPadPro = new DeviceOption('ipad-pro', 'iPad Pro', 1366, 1024);

    const surfacePro7 = new DeviceOption('surface-pro-7', 'Surface Pro 7', 1368, 812);
    const surfaceDuo = new DeviceOption('surface-duo', 'Surface Duo', 720, 540);
    const galaxyZFold5 = new DeviceOption('galaxy-z-fold-5', 'Galaxy Z Fold 5', 882, 344);
    const asusZenbookFold = new DeviceOption('asus-zenbook-fold', 'Asus Zenbook Fold', 1280, 853);
    const samsungGalaxyA51A71 = new DeviceOption('samsung-galaxy-a15-17', 'Samsung Galaxy A51/71', 914, 412);
    const nestHub = new DeviceOption('nest-hub', 'Nest Hub', 600, 1024);
    const nestHubMax = new DeviceOption('nest-hub-max', 'Nest Hub Max', 800, 1280);


    const devices = [iPhoneSE, iPhoneXR, iPhone12Pro,
        iPhone14MaxPro, pixel7, samsungGalaxyS8Plus,
        samsungGalaxyS20Ultra, iPadMini, iPadAir, iPadPro,
        surfacePro7, surfaceDuo, galaxyZFold5, asusZenbookFold,
        samsungGalaxyA51A71, nestHub, nestHubMax];
    const app = new AppManager(devices);
    app.init();
});