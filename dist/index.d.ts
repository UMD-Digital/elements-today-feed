declare global {
    interface Window {
        TodayFeedElement: typeof TodayFeedElement;
    }
}
export default class TodayFeedElement extends HTMLElement {
    _shadow: ShadowRoot;
    _token: string | null;
    _categories: string[] | null;
    constructor();
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    connectedCallback(): void;
}
//# sourceMappingURL=index.d.ts.map