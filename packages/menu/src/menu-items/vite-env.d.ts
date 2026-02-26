/// <reference types="vite/client" />

declare module '*?url' {
    const url: string;
    export default url;
}

declare module '*?worker' {
    const workerConstructor: new () => Worker;
    export default workerConstructor;
}
