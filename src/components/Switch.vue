<script setup lang="ts">
/**
 * Switch — plain implementation, no reka-ui dependency issues
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

const sizeConfig = {
  xs: { trackWidth: '28px', trackHeight: '16px', thumbSize: '12px', thumbOffset: '12px' },
  sm: { trackWidth: '32px', trackHeight: '18px', thumbSize: '14px', thumbOffset: '14px' },
  md: { trackWidth: '40px', trackHeight: '20px', thumbSize: '16px', thumbOffset: '20px' },
} as const

const currentSize = computed(() => sizeConfig[props.size])

const rootClass = computed(() => ({
  'cui-switch--disabled': props.disabled,
}))

const trackClass = computed(() => ({
  'cui-switch__track--checked': props.modelValue,
  'cui-switch__track--disabled': props.disabled,
}))

const trackStyle = computed(() => ({
  width: currentSize.value.trackWidth,
  height: currentSize.value.trackHeight,
}))

const thumbStyle = computed(() => ({
  width: currentSize.value.thumbSize,
  height: currentSize.value.thumbSize,
  transform: props.modelValue
    ? `translate(${currentSize.value.thumbOffset}, -50%)`
    : 'translate(0, -50%)',
}))

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label class="cui-switch" :class="rootClass" @click.prevent="toggle">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :data-state="modelValue ? 'checked' : 'unchecked'"
      :disabled="disabled"
      class="cui-switch__track"
      :class="trackClass"
      :style="trackStyle"
      @click.stop="toggle"
    >
      <span class="cui-switch__thumb" :style="thumbStyle" />
    </button>
    <span v-if="label" class="cui-switch__label">{{ label }}</span>
    <slot />
  </label>
</template>

<style>
.cui-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.cui-switch--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cui-switch__track {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--app-border);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cui-switch__track--checked {
  background: var(--app-accent);
}

.cui-switch__track--disabled {
  cursor: not-allowed;
}

.cui-switch__track:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--app-accent) 35%, transparent);
}

.cui-switch__thumb {
  position: absolute;
  top: 50%;
  left: 2px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease;
}

.cui-switch__label {
  font-size: 0.875rem;
  color: var(--app-foreground);
}
</style>
