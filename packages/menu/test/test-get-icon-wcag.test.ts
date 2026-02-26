import {describe, it} from 'vitest';
import ist from 'ist';
import {getIcon} from "@src/menubar/icons/get-icon";
import {icons} from "@src/menubar/icons/icons";

describe("getIcon WCAG Compliance", () => {
    describe("button vs div element", () => {
        it("should create button element when isLegacy=false (default)", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            ist(icon.tagName, "BUTTON");
            ist(icon.classList.contains("ProseMirror-icon"), true);
        });

        it("should create div element when isLegacy=true (backward compatibility)", () => {
            const icon = getIcon(document, icons.strong, "Bold", false, true);
            
            ist(icon.tagName, "DIV");
            ist(icon.classList.contains("ProseMirror-icon"), true);
        });
    });

    describe("SVG icons with WCAG label", () => {
        it("should add wcag-label span when isLegacy=false (default)", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            const wcagLabel = icon.querySelector(".wcag-label");
            ist(wcagLabel !== null, true);
            ist(wcagLabel?.textContent, "Bold");
        });

        it("should not add wcag-label span when isLegacy=true (backward compatibility)", () => {
            const icon = getIcon(document, icons.strong, "Bold", true);
            
            const wcagLabel = icon.querySelector(".wcag-label");
            ist(wcagLabel, null);
        });

        it("should set aria-hidden=true on SVG element", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            const svg = icon.querySelector("svg");
            ist(svg?.getAttribute("aria-hidden"), "true");
        });

        it("should set tabindex=-1 on icon element", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            ist(icon.tabIndex, -1);
        });

        it("should update tabindex to 0 on focus", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            icon.dispatchEvent(new Event('focus'));
            ist(icon.tabIndex, 0);
        });

        it("should reset tabindex to -1 on blur", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            icon.dispatchEvent(new Event('focus'));
            ist(icon.tabIndex, 0);
            
            icon.dispatchEvent(new Event('blur'));
            ist(icon.tabIndex, -1);
        });
    });

    describe("DOM icons with WCAG label", () => {
        it("should add wcag-label span for DOM icons", () => {
            const domElement = document.createElement('span');
            domElement.textContent = '★';
            
            const domIcon = { dom: domElement };
            const icon = getIcon(document, domIcon, "Favorite");
            
            const wcagLabel = icon.querySelector(".wcag-label");
            ist(wcagLabel !== null, true);
            ist(wcagLabel?.textContent, "Favorite");
        });

        it("should set aria-hidden=true on cloned DOM element", () => {
            const domElement = document.createElement('span');
            domElement.textContent = '★';
            
            const domIcon = { dom: domElement };
            const icon = getIcon(document, domIcon, "Favorite");
            
            const clonedElement = icon.firstChild as HTMLElement;
            ist(clonedElement?.getAttribute("aria-hidden"), "true");
        });
    });

    describe("text icons", () => {
        it("should create text icon without wcag-label", () => {
            const textIcon = { text: "B" };
            const icon = getIcon(document, textIcon, "Bold", true);
            
            const span = icon.querySelector("span");
            ist(span !== null, true);
            ist(span?.textContent, "B");
            
            const wcagLabel = icon.querySelector(".wcag-label");
            ist(wcagLabel, null);
        });

        it("should apply custom CSS to text icon", () => {
            const textIcon = { text: "B", css: "font-weight: bold;" };
            const icon = getIcon(document, textIcon, "Bold", true);
            
            const span = icon.querySelector("span") as HTMLElement;
            ist(span.style.fontWeight, "bold");
        });
    });

    describe("icon sizing with WCAG", () => {
        it("should not set inline width style when isLegacy=false (default)", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            const svg = icon.querySelector("svg") as SVGSVGElement;
            ist(svg.style.width, "");
        });

        it("should set inline width style when isLegacy=true (backward compatibility)", () => {
            const icon = getIcon(document, icons.strong, "Bold", false, true);
            
            const svg = icon.querySelector("svg") as SVGSVGElement;
            ist(svg.style.width !== "", true);
        });
    });

    describe("SVG symbol references", () => {
        it("should create SVG symbol in document collection", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            const collection = document.getElementById("ProseMirror-icon-collection");
            ist(collection !== null, true);
        });

        it("should reference symbol using xlink:href", () => {
            const icon = getIcon(document, icons.strong, "Bold");
            
            const svg = icon.querySelector("svg");
            const use = svg?.querySelector("use");
            ist(use !== null, true);
            
            const href = use?.getAttributeNS("http://www.w3.org/1999/xlink", "href");
            ist(href?.includes("pm-icon-"), true);
        });

        it("should reuse existing symbol definitions", () => {
            const icon1 = getIcon(document, icons.strong, "Bold");
            const icon2 = getIcon(document, icons.strong, "Bold");
            
            const collection = document.getElementById("ProseMirror-icon-collection");
            const symbols = collection?.querySelectorAll("symbol");
            
            // Both icons should reference the same symbol
            const svg1 = icon1.querySelector("svg use");
            const svg2 = icon2.querySelector("svg use");
            
            const href1 = svg1?.getAttributeNS("http://www.w3.org/1999/xlink", "href");
            const href2 = svg2?.getAttributeNS("http://www.w3.org/1999/xlink", "href");
            
            ist(href1, href2);
        });
    });

    describe("multiple icon types", () => {
        it("should handle all icon types correctly with WCAG", () => {
            // SVG icon
            const svgIcon = getIcon(document, icons.strong, "Bold");
            ist(svgIcon.querySelector("svg") !== null, true);
            ist(svgIcon.querySelector(".wcag-label") !== null, true);
            
            // DOM icon
            const domElement = document.createElement('i');
            domElement.className = 'custom-icon';
            const domIcon = getIcon(document, { dom: domElement }, "Custom");
            ist(domIcon.querySelector("i.custom-icon") !== null, true);
            ist(domIcon.querySelector(".wcag-label") !== null, true);
            
            // Text icon
            const textIcon = getIcon(document, { text: "T" }, "Text", true);
            ist(textIcon.querySelector("span") !== null, true);
        });
    });

    describe("empty or undefined title", () => {
        it("should not create wcag-label when title is empty", () => {
            const icon = getIcon(document, icons.strong, "");
            
            const wcagLabel = icon.querySelector(".wcag-label");
            ist(wcagLabel, undefined);
        });
    });
});
