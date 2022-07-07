

enum Browser {
    SAFARI = 'safari',
    CHROME = 'chrome',
    FIREFOX = 'firefox',
    EDGE = 'edge',
    OPERA = 'opera',
    IE = 'ie',
    WEIXIN = 'micromessenger',
}

enum OS {
    ANDROID = 'android',
    IOS = 'ios',
    MAC_OS = 'macos',
    WINDOWS = 'windows',
    FIREFOX_OS = 'firefoxos',
}

/**
 * Browser matching rules
 * 
 * @type {Array}
 */
const BrowserRules = [
    [Browser.WEIXIN, /Mobile.*\/.*MicroMessenger/],
    [Browser.EDGE, /Edge\/([0-9._]+)/],
    [Browser.CHROME, /(?!Chrom.*OPR)(Chrom(?:e|ium)|CriOS)\/([0-9.]+)(:?\s|$)/],
    [Browser.FIREFOX, /Firefox\/([0-9.]+)(?:\s|$)/],
    [Browser.OPERA, /Opera\/([0-9.]+)(?:\s|$)/],
    [Browser.OPERA, /OPR\/([0-9.]+)(:?\s|$)$/],
    [Browser.IE, /Trident\/7\.0.*rv:([0-9.]+)\).*Gecko$/],
    [Browser.IE, /MSIE\s([0-9.]+);.*Trident\/[4-7].0/],
    [Browser.IE, /MSIE\s(7\.0)/],
    [Browser.SAFARI, /Version\/([0-9._]+).*Safari/],
];
/**
 * Operating system matching rules.
 * 
 * @type {Array}
 */
const OSRules = [
    [OS.IOS, /os ([._\d]+) like mac os/i],
    [OS.MAC_OS, /mac os x/i],
    [OS.ANDROID, /android/i],
    [OS.FIREFOX_OS, /mozilla\/[a-z._\d]+ \((?:mobile)|(?:tablet)/i],
    [OS.WINDOWS, /windows\s*(?:nt)?\s*[._\d]*/i],
];

class Platform {
    private readonly browser?: Browser;

    private readonly os?: OS;

    public constructor() {
        this.browser = this.getBrowserName();
        this.os = this.getOSName();
    }

    public getBrowserName(): Browser | undefined {
        for (const [name, regexp] of BrowserRules) {
            if ((regexp as RegExp).test(window.navigator.userAgent)) {
                return name as Browser;
            }
        }
        return;
    }

    public getOSName(): OS | undefined {
        for (const [name, regexp] of OSRules) {
            if ((regexp as RegExp).test(window.navigator.userAgent)) {
                return name as OS;
            }
        }
        return;
    }

    public isSafari() {
        return this.browser === Browser.SAFARI;
    }

    public isChrome() {
        return this.browser === Browser.CHROME;
    }

    public isAndroid() {
        return this.os === OS.ANDROID;
    }

    public isIOS() {
        return this.os === OS.IOS;
    }

    public isMac() {
        return this.os === OS.MAC_OS;
    }

    public isWindows() {
        return this.os === OS.WINDOWS;
    }

    public isMobile() {
        return this.isAndroid() || this.isIOS();
    }

    public isWeixin() {
        return this.browser === Browser.WEIXIN;
    }

    public isElectron() {
        return /electron/i.test(window.navigator.userAgent);
    }

    public getMobileApp() {
        const app = [
            Browser.WEIXIN,
            Browser.CHROME,
            Browser.SAFARI,
        ].find(browser => this.browser === browser);
        return app === Browser.WEIXIN ? 'weixin' : app ?? 'other';
    }

    public isIPhoneX() {
        return (
            navigator.userAgent.toLowerCase().indexOf('iphone') > -1 &&
            window.screen.height >= 812 &&
            window.devicePixelRatio >= 2
        );
    }

    public getIOSVersion() {
        if (this.isIOS()) {
            const v = window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
            return Number(v?.[1]);
        }
        return null;
    }
}

const platform = new Platform();

export { platform, Platform };
