import dts from 'vite-plugin-dts';
import {defineProject} from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";


export default defineProject({
    plugins: [
        dts({
            rollupTypes: false,
            outDir: 'dist',
            entryRoot: 'src',
        }),
        tsconfigPaths({
            projects: ['./tsconfig.json']
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
