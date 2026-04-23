<script setup lang="ts">
/**
 * Card - Nuxt UI v3 compatible card
 */
withDefaults(defineProps<{
  title?: string
  description?: string
  variant?: 'default' | 'outline'
}>(), {
  title: '',
  description: '',
  variant: 'default',
})
</script>

<template>
  <div
    :class="[
      'rounded-sm text-[var(--app-foreground)]',
      variant === 'outline'
        ? 'border border-[var(--app-border)]'
        : 'bg-[var(--app-background)] border border-[var(--app-border)]',
    ]"
  >
    <div v-if="title || description || $slots.header" class="px-5 py-4 border-b border-[var(--app-border)]">
      <slot name="header">
        <h3 v-if="title" class="text-[11px] tracking-[0.12em] uppercase font-medium text-[var(--app-muted)]">{{ title }}</h3>
        <p v-if="description" class="text-sm text-[var(--app-foreground)] mt-1">{{ description }}</p>
      </slot>
    </div>
    <div class="p-5">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-5 py-4 border-t border-[var(--app-border)]">
      <slot name="footer" />
    </div>
  </div>
</template>
