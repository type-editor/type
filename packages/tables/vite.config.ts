import dts from 'vite-plugin-dts';
import {defineProject} from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";

import {playwright} from "@vitest/browser-playwright";


export default ({mode}) => {
    return defineProject({
        plugins: [
            dts({rollupTypes: true}),
            tsconfigPaths({
                projects: ['./tsconfig.json', './test/tsconfig.json', './test-browser/tsconfig.json']
            })
        ],
        test: {
            projects: [
                {
                    extends: true,
                    test: {
                        globals: true,
                        environment: 'jsdom',
                        setupFiles: ['./test/setup-jsdom-mocks.ts'],
                        includeSource: ['test/**/*.test.ts'],
                        include: [
                            'test/**/*.test.ts'
                        ],
                        exclude: [
                            'test-browser/**/*.test.ts'
                        ],
                    },
                },
                {
                    extends: true,
                    test: {
                        globals: true,
                        browser: {
                            provider: playwright(),
                            enabled: true,
                            headless: true,
                            screenshotFailures: false,
                            instances: [
                                {
                                    browser: 'chromium',
                                },
                            ],
                        },
                        includeSource: ['test-browser/**/*.test.ts'],
                        include: [
                            'test-browser/**/*.test.ts'
                        ],
                        exclude: [
                            'test/**/*.test.ts'
                        ],
                    },
                },
            ]
        },
        build: {
            outDir: 'dist',
            assetsDir: '',
            emptyOutDir: true,
            minify: 'terser',
            rollupOptions: {
                input: mode === 'development' ? 'preview/index.html' : 'src/index.ts',
                preserveEntrySignatures: "allow-extension",
                output: [
                    {
                        format: 'cjs',
                        entryFileNames: "index.cjs",
                    },
                    {
                        format: 'es',
                        entryFileNames: "index.js",
                    }
                ],
                external: [
                    /^@type-editor.*/,
                ]
            },
        },
        server: {
            open: '/preview/index.html',
        },
    });
};
