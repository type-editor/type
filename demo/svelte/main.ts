import { mount } from 'svelte';

import App from './App.svelte';

const editor = mount(App, {
    target: document.getElementById('app'),
});

export default editor;
