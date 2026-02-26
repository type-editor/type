import {resolve} from 'node:path';
import dts from 'vite-plugin-dts';
import {defineProject} from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";

import {playwright} from "@vitest/browser-playwright";


export default defineProject({
    plugins: [
        dts({rollupTypes: true}),
        tsconfigPaths({
            projects: ['./tsconfig.json', './test/tsconfig.json']
        })
    ],
    test: {
        projects: [
            {
                extends: true,
                test: {
                    globals: true,
                    environment: 'jsdom',
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
            input: 'src/index.ts',
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
    }
});
