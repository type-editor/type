export interface Browser {
    ie : boolean;
    ie_version: number;
    gecko: boolean;
    gecko_version: number;
    chrome: boolean;
    chrome_version: number;
    safari: boolean;
    ios: boolean;
    mac: boolean;
    windows: boolean;
    android : boolean;
    webkit: boolean;
    webkit_version: number;
    dir : 'rtl' | 'ltr';
}

/**
 * Minimal Navigator implementation for Node.js environments
 * Provides default values that indicate a non-browser environment
 */
// class NodejsNavigator implements Navigator {
//     readonly userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';
//     readonly vendor: string = 'Google Inc.';
//     readonly platform: string = 'MacIntel';
//     readonly maxTouchPoints: number = 0;
//
//     // Additional required Navigator properties with minimal implementations
//     readonly appCodeName: string = 'Mozilla';
//     readonly appName: string = 'Netscape';
//     readonly appVersion: string = '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';
//     readonly cookieEnabled: boolean = false;
//     readonly language: string = 'en';
//     readonly languages: ReadonlyArray<string> = ['en'];
//     readonly onLine: boolean = true;
//     readonly product: string = 'Gecko';
//     readonly productSub: string = '20030107';
//     readonly vendorSub: string = '';
//
//     // Methods
//     javaEnabled(): boolean { return false; }
//     sendBeacon(): boolean { return false; }
//     vibrate(): boolean { return false; }
//
//     // Properties not used in this file but required by Navigator interface
//     readonly hardwareConcurrency: number = 1;
//     readonly clipboard: Clipboard = {} as Clipboard;
//     readonly credentials: CredentialsContainer = {} as CredentialsContainer;
//     readonly geolocation: Geolocation = {} as Geolocation;
//     readonly mediaDevices: MediaDevices = {} as MediaDevices;
//     readonly permissions: Permissions = {} as Permissions;
//     readonly serviceWorker: ServiceWorkerContainer = {} as ServiceWorkerContainer;
//     readonly storage: StorageManager = {} as StorageManager;
//     readonly locks: LockManager = {} as LockManager;
//     readonly mediaCapabilities: MediaCapabilities = {} as MediaCapabilities;
//     readonly mediaSession: MediaSession = {} as MediaSession;
//     readonly pdfViewerEnabled: boolean = false;
//     readonly doNotTrack: string | null = null;
//     readonly webdriver: boolean = false;
//     readonly mimeTypes: MimeTypeArray = [] as unknown as MimeTypeArray;
//     readonly plugins: PluginArray = [] as unknown as PluginArray;
//     readonly login: NavigatorLogin = {
//         setStatus(): Promise<void> { return Promise.resolve(); }
//     };
//     readonly userActivation: UserActivation = {
//         hasBeenActive: false,
//         isActive: false
//     };
//     readonly wakeLock: WakeLock = {} as WakeLock;
//
//     // Additional methods to satisfy Navigator interface
//     getGamepads(): Array<Gamepad> { return []; }
//     registerProtocolHandler(): void { /* no-op */ }
//     share(): Promise<void> { return Promise.resolve(); }
//     requestMediaKeySystemAccess(): Promise<MediaKeySystemAccess> {
//         return Promise.reject(new Error('Not supported'));
//     }
//     requestMIDIAccess(): Promise<MIDIAccess> {
//         return Promise.reject(new Error('Not supported'));
//     }
//     clearAppBadge(): Promise<void> { return Promise.resolve(); }
//     setAppBadge(): Promise<void> { return Promise.resolve(); }
//     canShare(): boolean { return false; }
// }

const nav: Navigator = typeof navigator !== 'undefined' && navigator.userAgent ? navigator : null;
const doc: Document = typeof document !== 'undefined' ? document : null;
const agent: string = nav?.userAgent ? nav.userAgent : '';

const ie_edge = /Edge\/(\d+)/.exec(agent);
const ie_upto10 = /MSIE \d/.exec(agent);
const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(agent);

const ie = !!(ie_upto10 || ie_11up || ie_edge);
const ie_version = ie_upto10 ? 0 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0;
const gecko = !ie && /gecko\/(\d+)/i.test(agent);
const gecko_version = !gecko ? 0 : +(/Firefox\/(\d+)/.exec(agent) || [0, 0])[1];

const _chrome = !ie && /Chrome\/(\d+)/.exec(agent);
const chrome = !!_chrome;
const chrome_version = _chrome ? +_chrome[1] : 0;
const safari = !ie && nav?.vendor?.includes('Apple Computer');
// Is true for both iOS and iPadOS for convenience
const ios = safari && (/Mobile\/\w+/.test(agent) || nav?.maxTouchPoints > 2);
const mac = ios || nav?.platform?.includes('Mac');
const windows = nav?.platform?.includes('Win');
const android = /Android \d/.test(agent);
const webkit = doc && 'webkitFontSmoothing' in doc.documentElement.style;
const webkit_version = webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;

const dir = doc?.dir === 'rtl' ? 'rtl' : 'ltr';

export const browser: Browser = {
    ie,
    ie_version,
    gecko,
    gecko_version,
    chrome,
    chrome_version,
    safari,
    ios,
    mac,
    windows,
    android,
    webkit,
    webkit_version,
    dir
};


// from menubar.ts
// const isIOS = (): boolean => {
//     if (typeof navigator === 'undefined') {
//         return false;
//     }
//     const agent: string = navigator.userAgent;
//     return !/Edge\/\d/.test(agent) && agent.includes('AppleWebKit') && /Mobile\/\w+/.test(agent);
// };
