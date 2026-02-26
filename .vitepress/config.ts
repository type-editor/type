import {defineConfig} from 'vitepress'
import packageJson from '../package.json';

export default defineConfig({
    srcDir: 'docs',
    outDir: `./website/${packageJson.version}`,

    srcExclude: ['**/vite-env/**'],

    title: `Type Editor Documentation - ${packageJson.version}`,
    description: "Another ProseMirror clone",
    base: `/${packageJson.version}/`,

    head: [
        [
            'script',
            {
                src: '/versions.js',
                defer: 'defer'
            }
        ]
    ],

    themeConfig: {
        logoLink: {
            link: '/',
            target: '_self' // explicit target is needed to prevent
                            // vitepress router from intercepting link
        },
        // logo: '/type-logo-icon.svg',
        nav: [
            {
                component: 'NavVersion',
                props: {
                    currentVersion: packageJson.version,
                }
            }
        ],

        // sidebar: [
        //     {
        //         text: 'Modules',
        //         items: [
        //             {text: 'Readme', link: `/README.html`},
        //             {text: 'Modules', link: `/modules.html`}
        //         ]
        //     },
        // ],

        socialLinks: [
            {icon: 'github', link: 'https://github.com/type-editor/type'}
        ],

        search: {
            provider: 'local'
        }
    },
    ignoreDeadLinks: true
})
