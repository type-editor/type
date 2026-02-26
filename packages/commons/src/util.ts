export function isUndefinedOrNull(value: unknown): boolean {
    return value === null || value === undefined;
}

export function isTrue(value: unknown): boolean {
    if(typeof value !== 'string') {
        return false;
    }
    return value.toLowerCase() === 'true' || value.toLowerCase() === '1';
}

export function isNotFalse(value: unknown): boolean {
    if(isUndefinedOrNull(value)) {
        return true;
    }
    return value !== false;
}

export function isFalse(value: unknown): boolean {
    return !isNotFalse(value);

}

export function hasOwnProperty(object: unknown, key: unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return !isUndefinedOrNull(object) && !isUndefinedOrNull(key) && Object.prototype.hasOwnProperty.call(object, key);
}
