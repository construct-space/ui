<script setup lang="ts">
/**
 * Switch — plain implementation with inline styles (no CSS class conflicts)
 */
const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md'
}>(), {
  modelValue: false,
  label: '',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizes = {
  xs: { w: 28, h: 16, thumb: 12 },
  sm: { w: 32, h: 18, thumb: 14 },
  md: { w: 40, h: 20, thumb: 16 },
} as const

const s = computed(() => sizes[props.size])

const trackStyle = computed(() => ({
  position: 'relative' as const,
  display: 'inline-flex',
  flexShrink: 0,
  width: `${s.value.w}px`,
  height: `${s.value.h}px`,
  borderRadius: '999px',
  backgroundColor: props.modelValue ? 'var(--app-accent)' : 'var(--app-muted, #64748b)',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  transition: 'background-color 0.2s ease',
  border: 'none',
  padding: 0,
  opacity: props.disabled ? 0.5 : 1,
  outline: 'none',
}))

const thumbStyle = computed(() => ({
  position: 'absolute' as const,
  top: '50%',
  left: '2px',
  width: `${s.value.thumb}px`,
  height: `${s.value.thumb}px`,
  borderRadius: '999px',
  backgroundColor: '#fff',
  boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
  transition: 'transform 0.2s ease',
  transform: props.modelValue
    ? `translate(${s.value.w - s.value.thumb - 4}px, -50%)`
    : 'translate(0, -50%)',
}))

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none" @click.prevent="toggle">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      :style="trackStyle"
      @click.stop="toggle"
    >
      <span :style="thumbStyle" />
    </button>
    <span v-if="label" style="font-size: 0.875rem; color: var(--app-foreground)">{{ label }}</span>
    <slot />
  </label>
</template>
