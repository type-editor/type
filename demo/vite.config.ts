import { svelte } from '@sveltejs/vite-plugin-svelte';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { rename, rm } from 'fs/promises';
import { glob } from 'fs/promises';
import { resolve } from 'path';
import {defineConfig, type Plugin} from 'vite';
// import { viteStaticCopy } from 'vite-plugin-static-copy';

function renameOutputHtml(from: string, to: string): Plugin {
    return {
        name: 'rename-output-html',
        closeBundle: async () => {
            const outDir = resolve(__dirname, '../website');
            await rename(resolve(outDir, from), resolve(outDir, to));
        },
    };
}

function cleanWebsite(): Plugin {
    return {
        name: 'clean-website',
        buildStart: async () => {
            const outDir = resolve(__dirname, '../website');
            const patterns = ['*.js', '*.css', '*.html', '*.svg'];
            for (const pattern of patterns) {
                for await (const file of glob(resolve(outDir, pattern))) {
                    await rm(file, { force: true });
                }
            }
            const dirs = ['plain', 'react', 'svelte', 'vue'];
            for (const dir of dirs) {
                await rm(resolve(outDir, dir), { recursive: true, force: true });
            }
        },
    };
}


export default ({mode}) => {
    return defineConfig({
        define: {
            // Polyfill Node.js process for browser-incompatible dependencies (e.g. pdfjs-dist)
            'process.env': {},
        },
        plugins: [
            // viteStaticCopy({
            //     targets: [
            //         {
            //             src: './node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
            //             dest: mode === 'development' ? './worker' : './public/worker',
            //         },
            //     ],
            // }),
            vue(),
            svelte(),
            react(),
            mode === 'production' && cleanWebsite(),
            mode !== 'development' && renameOutputHtml('index-web.html', 'index.html'),
        ],
        build: {
            outDir: mode === 'development' ? 'dist' : '../website',
            assetsDir: '',
            emptyOutDir: mode === 'development',
            minify: 'terser',
            rollupOptions: {
                input: {
                    main: mode === 'development' ? 'index.html' : 'index-web.html',
                    plain: 'plain/index.html',
                    vue: 'vue/index.html',
                    react: 'react/index.html',
                    svelte: 'svelte/index.html',
                },
                preserveEntrySignatures: 'allow-extension',
                output: [
                    {
                        format: 'es',
                    }
                ],
                external: [
                    'pdfjs-dist',
                ]
            },
        },
        server: {
            open: 'index.html',
        },
    });
};
