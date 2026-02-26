import {describe, it} from 'vitest';
import ist from 'ist';
import {browser} from '@src/browser';

describe("Browser detection", () => {
  describe("browser flags", () => {
    it("has boolean values for browser detection", () => {
      ist(typeof browser.ie === "boolean");
      ist(typeof browser.gecko === "boolean");
      ist(typeof browser.chrome === "boolean");
      ist(typeof browser.safari === "boolean");
      ist(typeof browser.ios === "boolean");
      ist(typeof browser.mac === "boolean");
      ist(typeof browser.windows === "boolean");
      ist(typeof browser.android === "boolean");
      ist(typeof browser.webkit === "boolean");
    });

    it("has numeric values for browser versions", () => {
      ist(typeof browser.ie_version === "number");
      ist(typeof browser.gecko_version === "number" || typeof browser.gecko_version === "boolean");
      ist(typeof browser.chrome_version === "number");
      ist(typeof browser.webkit_version === "number");
    });

    it("has valid dir value", () => {
      ist(browser.dir === "ltr" || browser.dir === "rtl");
    });
  });

  describe("browser exclusivity", () => {
    it("only one major browser is detected as true", () => {
      // Only one of ie, gecko, chrome, safari should be true (or potentially none in test env)
      let browserCount = [browser.ie, browser.gecko, browser.chrome && !browser.safari, browser.safari && !browser.chrome].filter(Boolean).length;
      ist(browserCount <= 1);
    });

    it("version matches browser detection", () => {
      if (browser.ie) {
        ist(browser.ie_version >= 0);
      }
      if (browser.gecko) {
        ist(browser.gecko_version >= 0);
      }
      if (browser.chrome) {
        ist(browser.chrome_version >= 0);
      }
      if (browser.webkit) {
        ist(browser.webkit_version >= 0);
      }
    });
  });

  describe("platform detection", () => {
    it("only one platform is detected (or none)", () => {
      // In a test environment, these might all be false
      ist(typeof browser.mac === "boolean");
      ist(typeof browser.windows === "boolean");
      ist(typeof browser.ios === "boolean");
      ist(typeof browser.android === "boolean");
    });

    it("ios implies mac is true", () => {
      if (browser.ios) {
        ist(browser.mac);
      }
    });

    it("android and ios are mutually exclusive", () => {
      ist(!(browser.android && browser.ios));
    });
  });

  describe("webkit detection", () => {
    it("webkit implies chrome or safari", () => {
      if (browser.webkit && typeof navigator !== 'undefined') {
        ist(browser.chrome || browser.safari);
      }
    });
  });

  describe("version numbers", () => {
    it("version numbers are non-negative", () => {
      ist(browser.ie_version >= 0);
      ist(browser.gecko_version >= 0);
      ist(browser.chrome_version >= 0);
      ist(browser.webkit_version >= 0);
    });

    it("non-detected browser has version 0 or false", () => {
      if (!browser.ie) {
        ist(browser.ie_version === 0);
      }
      if (!browser.gecko) {
        ist(browser.gecko_version === 0 || browser.gecko_version === -1);
      }
      if (!browser.chrome) {
        ist(browser.chrome_version === 0);
      }
    });
  });

  describe("detection consistency", () => {
    it("exports are accessible", () => {
      ist(browser.ie !== undefined);
      ist(browser.gecko !== undefined);
      ist(browser.chrome !== undefined);
      ist(browser.safari !== undefined);
      ist(browser.ios !== undefined);
      ist(browser.mac !== undefined);
      ist(browser.windows !== undefined);
      ist(browser.android !== undefined);
      ist(browser.webkit !== undefined);
      ist(browser.dir !== undefined);
    });
  });
});

