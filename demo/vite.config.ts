import { svelte } from '@sveltejs/vite-plugin-svelte';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { rename } from 'fs/promises';
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
                preserveEntrySignatures: "allow-extension",
                output: [
                    {
                        format: 'es',
                    }
                ],
            },
        },
        server: {
            open: 'index.html',
        },
    });
};
