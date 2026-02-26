<script setup lang="ts">
import { ProsemirrorAdapterProvider } from '@type-editor/adapter-vue'
import Editor from './Editor.vue'
</script>

<template>
    <ProsemirrorAdapterProvider>
        <Editor />
    </ProsemirrorAdapterProvider>
</template>
