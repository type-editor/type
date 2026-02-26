
declare global {
    interface JSONRecord {
        [key: string]: JSONObject
    }

    type JSONObject =
        | string
        | number
        | boolean
        | null
        | undefined
        | Array<JSONObject>
        | JSONRecord;
}


declare global {
    /**
     * Interface for Trusted Types API
     */
    interface TrustedTypesPolicy {
        createHTML(input: string): string;
    }

    interface TrustedTypes {
        defaultPolicy?: TrustedTypesPolicy;
        createPolicy(name: string, rules: { createHTML: (s: string) => string }): TrustedTypesPolicy;
    }

    export interface Window {
        trustedTypes?: TrustedTypes;
    }
}

declare global {
    interface Node {
        pmViewDesc?: PmViewDesc;
        pmIsDeco?: boolean;
    }
}

// Declare DOMNode and DOMSelection globally for backwards compatibility
declare global {
    type DOMNode = InstanceType<typeof window.Node>;
    type DOMSelection = InstanceType<typeof window.Selection>;
}
