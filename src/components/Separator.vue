<script setup lang="ts">
/**
 * Separator - Horizontal or vertical divider
 *
 * Props
 *  - label        optional centered text
 *  - orientation  'horizontal' (default) | 'vertical'
 *  - color        'default' (muted) | 'accent' | 'success' | 'warning' | 'error' | 'info'
 *
 * Slots
 *  - default      overrides the label for custom rendered content
 */
const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  label?: string
  color?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info'
}>(), {
  orientation: 'horizontal',
  color: 'default',
})

const lineClass = computed(() => {
  const map: Record<string, string> = {
    default: 'bg-[var(--app-border)]',
    accent: 'bg-app-accent/30',
    success: 'bg-emerald-500/30',
    warning: 'bg-amber-500/30',
    error: 'bg-red-500/30',
    info: 'bg-blue-500/30',
  }
  return map[props.color] || map.default
})

const labelClass = computed(() => {
  const map: Record<string, string> = {
    default: 'text-[var(--app-muted)]',
    accent: 'text-app-accent',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  }
  return map[props.color] || map.default
})
</script>

<template>
  <div
    v-if="orientation === 'horizontal'"
    class="flex items-center w-full"
    role="separator"
    :aria-orientation="orientation"
  >
    <template v-if="label || $slots.default">
      <div :class="['flex-1 h-px', lineClass]" />
      <span
        :class="[
          'px-3 text-[11px] tracking-[0.12em] uppercase font-normal shrink-0',
          labelClass,
        ]"
      >
        <slot>{{ label }}</slot>
      </span>
      <div :class="['flex-1 h-px', lineClass]" />
    </template>
    <div v-else :class="['w-full h-px', lineClass]" />
  </div>

  <div
    v-else
    class="inline-flex items-center self-stretch"
    role="separator"
    :aria-orientation="orientation"
  >
    <template v-if="label || $slots.default">
      <div :class="['flex-1 w-px', lineClass]" />
      <span
        :class="[
          'py-2 text-[11px] tracking-[0.12em] uppercase font-normal shrink-0 [writing-mode:vertical-lr]',
          labelClass,
        ]"
      >
        <slot>{{ label }}</slot>
      </span>
      <div :class="['flex-1 w-px', lineClass]" />
    </template>
    <div v-else :class="['h-full w-px', lineClass]" />
  </div>
</template>
