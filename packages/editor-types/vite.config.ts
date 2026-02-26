import dts from 'vite-plugin-dts';
import {defineProject} from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";

import {copyDts} from './vite-plugin-copy-dts';


export default defineProject({
    plugins: [
        dts({
            rollupTypes: true,
            outDir: 'dist/@types',
        }),
        tsconfigPaths({
            projects: ['./tsconfig.json']
        }),
        copyDts({
            sourceFile: 'src/@types/index.d.ts',
            targetFile: '@types/index.d.ts',
            outDir: 'dist'
        })
    ],
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
