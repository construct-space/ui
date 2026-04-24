<script setup lang="ts">
/**
 * Card — surface container with header / body / footer regions.
 *
 * Variants
 *  - default   bg-[var(--app-background)] — clean surface on canvas
 *  - outline   transparent + border — for stacking inside coloured contexts
 *  - muted     bg-[var(--app-canvas-bg)] — recedes behind sibling surfaces
 *
 * Modifiers
 *  - hoverable    soft lift on hover
 *  - interactive  cursor-pointer
 *
 * Slots (all optional)
 *  - header        full-override the header row (skips title/description/accessory)
 *  - accessory     right side of header (when using title/description props)
 *  - default       body content
 *  - footer        left side of footer
 *  - footer-end    right side of footer
 *
 * Props
 *  - title         header-left title
 *  - description   header-left description
 */
withDefaults(defineProps<{
  title?: string
  description?: string
  variant?: 'default' | 'outline' | 'muted'
  hoverable?: boolean
  interactive?: boolean
}>(), {
  variant: 'default',
  hoverable: false,
  interactive: false,
})
</script>

<template>
  <div
    :class="[
      'rounded-sm text-[var(--app-foreground)] transition-shadow duration-150',
      variant === 'default' && 'bg-[var(--app-background)]',
      variant === 'outline' && 'border border-[var(--app-border)]',
      variant === 'muted' && 'bg-[var(--app-canvas-bg)]',
      hoverable && 'hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)]',
      interactive && 'cursor-pointer',
    ]"
  >
    <!-- Header -->
    <div
      v-if="$slots.header || title || description || $slots.accessory"
      class="px-5 pt-5 pb-4 flex items-start justify-between gap-3"
    >
      <div class="min-w-0 flex-1 flex flex-col">
        <slot name="header">
          <h3 v-if="title" class="text-sm tracking-[0.08em] uppercase font-normal text-[var(--app-foreground)] leading-tight after:content-['.'] after:text-[var(--app-accent)]">{{ title }}</h3>
          <p v-if="description" class="text-sm text-[var(--app-muted)] mt-0.5">{{ description }}</p>
        </slot>
      </div>
      <div v-if="$slots.accessory" class="shrink-0">
        <slot name="accessory" />
      </div>
    </div>

    <!-- Body -->
    <div
      v-if="$slots.default"
      :class="[
        'px-5',
        $slots.header || title || description || $slots.accessory ? '' : 'pt-5',
        $slots.footer || $slots['footer-end'] ? 'pb-4' : 'pb-5',
        ($slots.header || title || description || $slots.accessory) && ($slots.footer || $slots['footer-end']) ? 'py-4' : '',
      ]"
    >
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="$slots.footer || $slots['footer-end']"
      class="px-5 pb-5 pt-4 flex items-center justify-between gap-3"
    >
      <div class="min-w-0 flex-1 flex flex-col">
        <slot name="footer" />
      </div>
      <div v-if="$slots['footer-end']" class="shrink-0">
        <slot name="footer-end" />
      </div>
    </div>
  </div>
</template>
