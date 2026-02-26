
// This is very crude, but unfortunately both these browsers _pretend_
// that they have a clipboard API—all the objects and methods are
// there, they just don't work, and they are hard to test.
import {browser} from '@type-editor/commons';

const IE_CLIPBOARD_MIN_VERSION = 15;
const IOS_CLIPBOARD_MIN_WEBKIT = 604;
export const brokenClipboardAPI = (browser.ie && browser.ie_version < IE_CLIPBOARD_MIN_VERSION)
    || (browser.ios && browser.webkit_version < IOS_CLIPBOARD_MIN_WEBKIT);
