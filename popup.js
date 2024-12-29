class TabConfig {
    constructor(tabId, deviceId, orientation) {
        this.tabId = tabId;
        this.deviceId = deviceId;
        this.orientation = orientation;
    }
    getTabId() {
        return this.tabId;
    }
    getDeviceId() {
        return this.deviceId;
    }
    getOrientation() {
        return this.orientation;
    }
    setOrientation(orientation) {
        this.orientation = orientation;
    }
    setDeviceId(deviceId) {
        this.deviceId = deviceId;
    }
    setTabId(tabId) {
        this.tabId = tabId;
    }
}
class TabConfigService {
    constructor() {
        this.tabConfigs = new Map();
    }
    addTabConfig(tabConfig) {
        this.tabConfigs.set(`tabId-${tabConfig.getTabId()}`, tabConfig);
        this.#addTabConfigsState(this.tabConfigs);
    }
    deleteTabConfig(tabId) {
        this.tabConfigs.delete(`tabId-${tabId}`);
        this.#addTabConfigsState(this.tabConfigs);
    }
    async getTabConfigs() {
        this.tabConfigs = await this.#getTabConfigsState();
        return this.tabConfigs;
    }

    #sendMessageToBackground(message, callback) {
        chrome.runtime.sendMessage(message, {}, callback);
    }

    #addTabConfigsState(config) {
        this.#sendMessageToBackground({ action: 'session_storage', perform: 'SET', data: { 'tabconfig': JSON.stringify(Array.from(config.entries())) } }, () => { });
    }
    async #getTabConfigsState() {
        return await new Promise((resolve) => {
            this.#sendMessageToBackground({ action: 'session_storage', perform: 'GET', data: { key: 'tabconfig' } }, (response) => {
                resolve(new Map(JSON.parse(response['tabconfig'])));
            });
        });
    }
}
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
        this.tabConfigService = new TabConfigService();
    }

    setDeviceOptions(sectionNum) {
        const pageHeadersElem = document.getElementsByClassName('lv-page-header');
        const pageHeaderLeft = document.createElement('div');
        pageHeaderLeft.className = 'lv-page-header-left';

        const pageHeaderMiddle = document.createElement('div');
        pageHeaderMiddle.className = 'lv-page-header-middle';

        const pageHeaderRight = document.createElement('div');
        pageHeaderRight.className = 'lv-page-header-right';

        const rotateIcon = document.createElement('img');
        rotateIcon.id = `rotate-device-${sectionNum}`;
        rotateIcon.src = './assets/rotate-device.png';
        rotateIcon.setAttribute('data-app', `rotate-device-${sectionNum}`);

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
        deviceOptionsDropdown.id = `section-dropdown-${sectionNum}`;
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

        rotateIcon.addEventListener('click', () => {
            const data = ("" + rotateIcon.getAttribute('data-app'));
            const sectionNum = data[data.length - 1];
            const section = document.getElementById(`section-${sectionNum}`);
            const sectionData = "" + section.getAttribute('data-app');
            const orientation = sectionData.split('-')[2] || 'portrait';
            const deviceOptionsDropdown = document.getElementById(`section-dropdown-${sectionNum}`);
            const selectedDevice = deviceOptionsDropdown.value;
            const device = this.deviceOptions.find(device => device.id === selectedDevice);
            if (selectedDevice && device) {
                const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
                this.changeDevice(selectedDevice, sectionNum, newOrientation);
            }
        });
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
                this.tabConfigService.deleteTabConfig(sectionNum);
            }
        });
    }

    setSection(tabId) {
        const sectionsRef = document.getElementsByClassName('lv-sections');

        const sectionElem = document.createElement('div');
        sectionElem.id = `section-${tabId}`;
        sectionElem.className = 'lv-section';
        sectionElem.setAttribute('data-app', `section-${tabId}-portrait`);

        const sectionHeaderElem = document.createElement('div');
        sectionHeaderElem.className = 'lv-page-header';

        const sectionContentElem = document.createElement('div');
        sectionContentElem.className = 'lv-section-tab';
        sectionContentElem.setAttribute('data-app', `tab-${tabId}`);

        const sectionContentIframeElem = document.createElement('iframe');
        sectionContentIframeElem.src = '/pages/page.html';
        sectionContentIframeElem.id = `iframe-${tabId}`;

        sectionContentElem.appendChild(sectionContentIframeElem);

        sectionElem.appendChild(sectionHeaderElem);
        sectionElem.appendChild(sectionContentElem);
        [...sectionsRef].forEach(section => section.appendChild(sectionElem));
        this.setDeviceOptions(tabId);
    }

    addTabs() {
        this.setSection(++this.tabs);
        this.setDefaultConfig();
    }

    addTab(tabConfig) {
        this.tabs = tabConfig.getTabId();
        this.setSection(tabConfig.getTabId());
        this.changeDevice(tabConfig.getDeviceId(), tabConfig.getTabId(), tabConfig.getOrientation(), false);
    }

    changeDevice(deviceId, sectionId, orientation = 'portrait', updateTabConfig = true) {
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
            iframe.style.maxHeight = config.height;
            iframe.style.maxWidth = config.width;
            iframe.style.minHeight = config.height;
            iframe.style.minWidth = config.width;

            // update the orientation
            const section = document.getElementById(`section-${sectionId}`);
            section.setAttribute('data-app', `section-${sectionId}-${orientation}`);

            // update the device dropdown
            const deviceOptionsDropdown = document.getElementById(`section-dropdown-${sectionId}`);
            deviceOptionsDropdown.value = deviceId;

            if (updateTabConfig) {
                // update the tab config
                const tabConfig = new TabConfig(sectionId, deviceId, orientation);
                this.tabConfigService.addTabConfig(tabConfig);
            }
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
    async loadTabs() {
        const tabConfigs = await this.tabConfigService.getTabConfigs();
        if (tabConfigs.size > 0) {
            tabConfigs.forEach(tabConfig => {
                const config = new TabConfig(tabConfig.tabId, tabConfig.deviceId, tabConfig.orientation);
                this.addTab(config);
            });
        } else {
            this.setSection(this.tabs);
            this.setDefaultConfig();
        }
    }
    init() {
        this.loadTabs();
        this.bindEvents();

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const iPhoneSE = new DeviceOption('iphone-se', 'iPhone SE', 667, 375);
    const iPhoneXR = new DeviceOption('iphone-xr', 'iPhone XR', 896, 414);
    const iPhone12Pro = new DeviceOption('iphone-12-pro', 'iPhone 12 Pro', 884, 390);

    const iPhone13Mini = new DeviceOption('iphone-13-mini', 'iPhone 13 Mini', 812, 375);
    const iPhone13 = new DeviceOption('iphone-13', 'iPhone 13', 844, 390);
    const iPhone13Pro = new DeviceOption('iphone-13-pro', 'iPhone 13 Pro', 844, 390);
    const iPhone13ProMax = new DeviceOption('iphone-13-pro-max', 'iPhone 13 Pro Max', 926, 428);

    const iPhone14 = new DeviceOption('iphone-14', 'iPhone 14', 844, 390);
    const iPhone14Pro = new DeviceOption('iphone-14-pro', 'iPhone 14 Pro', 852, 393);
    const iPhone14MaxPro = new DeviceOption('iphone-14-pro-max', 'iPhone 14 Pro Max', 932, 430);

    const iPhone15 = new DeviceOption('iphone-15', 'iPhone 15', 852, 393);
    const iPhone15Pro = new DeviceOption('iphone-15-pro', 'iPhone 15 Pro', 852, 393);
    const iPhone15Plus = new DeviceOption('iphone-15-plus', 'iPhone 15 Plus', 932, 430);
    const iPhone15ProMax = new DeviceOption('iphone-15-pro-max', 'iPhone 15 Pro Max', 932, 430);

    const iPhone16 = new DeviceOption('iphone-16', 'iPhone 16', 852, 393);
    const iPhone16ProMax = new DeviceOption('iphone-16-pro-max', 'iPhone 16 Pro Max', 956, 440);

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
        iPhone13Mini, iPhone13, iPhone13Pro, iPhone13ProMax,
        iPhone14, iPhone14Pro, iPhone14MaxPro,
        iPhone15, iPhone15Pro, iPhone15Plus, iPhone15ProMax,
        iPhone16, iPhone16ProMax,
        pixel7, samsungGalaxyS8Plus,
        samsungGalaxyS20Ultra, iPadMini, iPadAir, iPadPro,
        surfacePro7, surfaceDuo, galaxyZFold5, asusZenbookFold,
        samsungGalaxyA51A71, nestHub, nestHubMax];
    const app = new AppManager(devices);
    app.init();
});