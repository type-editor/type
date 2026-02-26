<script lang="ts">
  import { useProsemirrorAdapterProvider } from '@type-editor/adapter-svelte'
    import Editor from './Editor.svelte'

    useProsemirrorAdapterProvider()
</script>

<main>
  <Editor />
</main>
