/**
 * Interface for Trusted Types API
 */
export interface TrustedTypesPolicy {
    createHTML(input: string): string;
}

export interface TrustedTypes {
    defaultPolicy?: TrustedTypesPolicy;
    createPolicy(name: string, rules: { createHTML: (s: string) => string }): TrustedTypesPolicy;
}
