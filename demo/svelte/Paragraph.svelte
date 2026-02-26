<script lang="ts">
    import { useNodeViewContext } from '@type-editor/adapter-svelte';
    import { onMount } from 'svelte';

    const dom = useNodeViewContext('dom');
    const nodeStore = useNodeViewContext('node');

    function applyStyles(node: typeof $nodeStore) {
        if (!dom) return;
        dom.style.backgroundImage = 'url(\'/Svelte.svg\')';
        dom.style.backgroundRepeat = 'no-repeat';
        dom.style.backgroundPosition = 'center 0.2rem';
        dom.style.backgroundSize = '1rem 1rem'

        if (node.attrs.align) {
            dom.style.textAlign = node.attrs.align as string;
        }
    }

    onMount(() => applyStyles($nodeStore));
    $: applyStyles($nodeStore);
</script>

<!-- No template output — the <p> is created by the `as` factory in Editor.svelte.
     With contentAs: 'self', ProseMirror manages the content directly inside it. -->
