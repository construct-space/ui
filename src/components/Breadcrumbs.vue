<script setup lang="ts">
/**
 * Breadcrumbs — Construct UI
 * Navigation breadcrumb trail with chevron separators.
 */

export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()

const emit = defineEmits<{
  'navigate': [item: BreadcrumbItem]
}>()
</script>

<template>
  <nav class="flex items-center gap-2 text-[11px] tracking-[0.08em] uppercase font-medium">
    <template v-for="(crumb, i) in items" :key="i">
      <span v-if="i > 0" class="shrink-0 select-none" style="color: var(--app-muted); opacity: 0.5">/</span>
      <button
        v-if="crumb.to"
        class="hover:text-[var(--app-foreground)] transition-colors"
        style="color: var(--app-muted)"
        @click="emit('navigate', crumb)"
      >{{ crumb.label }}</button>
      <span v-else style="color: var(--app-foreground)">{{ crumb.label }}</span>
    </template>
  </nav>
</template>
