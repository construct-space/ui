<script setup lang="ts">
/**
 * ScrollArea - Plain implementation (no reka-ui)
 */
</script>

<template>
  <div class="relative overflow-auto scrollarea-custom">
    <slot />
  </div>
</template>

<style>
.scrollarea-custom {
  scrollbar-width: thin;
  scrollbar-color: var(--app-border) transparent;
}
.scrollarea-custom:hover {
  scrollbar-color: var(--app-muted) transparent;
}
.scrollarea-custom::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.scrollarea-custom::-webkit-scrollbar-track {
  background: transparent;
}
.scrollarea-custom::-webkit-scrollbar-thumb {
  background-color: var(--app-border);
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.scrollarea-custom::-webkit-scrollbar-thumb:hover {
  background-color: var(--app-muted);
}
</style>
