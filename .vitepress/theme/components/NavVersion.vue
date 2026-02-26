<script setup lang="ts">
import { ref } from 'vue'
import VPNavBarMenuGroup from 'vitepress/dist/client/theme-default/components/VPNavBarMenuGroup.vue'

const props = defineProps({
    currentVersion: String,
})

let docVersions = ref( globalThis['versions'] || [{text: props.currentVersion, link: '/'}] );

</script>

<template>
    <ClientOnly>
    <VPNavBarMenuGroup
        :item="{ text: currentVersion, items: docVersions }"
    />
    </ClientOnly>
</template>
