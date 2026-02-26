<script setup lang="ts">
import { useNodeViewContext } from '@type-editor/adapter-vue'
import { watchEffect } from 'vue'

const { dom, node } = useNodeViewContext()

watchEffect(() => {
    if (!dom) return

    dom.style.backgroundImage = "url('/Vue.svg')"
    dom.style.backgroundRepeat = 'no-repeat'
    dom.style.backgroundPosition = 'center center'
    dom.style.backgroundSize = '1rem 1rem'

    if (node.value?.attrs?.align) {
        dom.style.textAlign = node.value.attrs.align as string
    }
})
</script>



<!-- No template output — the <h1>–<h6> is created by the `as` factory in Editor.vue.
     With contentAs: 'self', ProseMirror manages the content directly inside it. -->
<template></template>
