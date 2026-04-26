<script setup lang="ts">
/**
 * Select — Construct UI
 * Compact dark native select matching the design panel aesthetic.
 */
import { Icon } from '@iconify/vue'

type SelectValue = string | number | null

export interface SelectOption {
  label: string
  value: SelectValue
  disabled?: boolean
  [key: string]: unknown
}

const props = withDefaults(defineProps<{
  modelValue?: SelectValue | SelectValue[]
  options?: SelectOption[] | string[]
  items?: SelectOption[] | string[]
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  multiple?: boolean
  icon?: string
  variant?: 'outline' | 'soft' | 'none'
  valueAttribute?: string
  optionAttribute?: string
}>(), {
  modelValue: null,
  options: () => [],
  placeholder: 'Select...',
  size: 'md',
  disabled: false,
  multiple: false,
  valueAttribute: 'value',
  optionAttribute: 'label',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

function toIconify(name: string) {
  if (name.startsWith('i-')) {
    const stripped = name.slice(2)
    const idx = stripped.indexOf('-')
    if (idx > 0) return stripped.slice(0, idx) + ':' + stripped.slice(idx + 1)
    return stripped
  }
  return name
}

const normalizedOptions = computed((): SelectOption[] => {
  const source = (props.items?.length ? props.items : props.options) ?? []
  return source.map(opt => {
    if (typeof opt === 'string') return { label: opt, value: opt }
    return opt as SelectOption
  })
})

const selectedValues = computed(() => {
  if (!Array.isArray(props.modelValue)) return new Set<string>()
  return new Set(props.modelValue.map(value => String(value)))
})

function onChange(e: Event) {
  const select = e.target as HTMLSelectElement
  if (props.multiple) {
    emit('update:modelValue', Array.from(select.selectedOptions, option => option.value))
    return
  }
  emit('update:modelValue', select.value)
}

const sizeClasses: Record<string, string> = {
  xs: 'h-6 text-xs',
  sm: 'h-7 text-xs',
  md: 'h-8 text-sm',
  lg: 'h-9 text-base',
}
</script>

<template>
  <div
    class="relative inline-flex items-center w-full rounded-sm border transition-colors duration-150 overflow-hidden"
    :class="[
      variant === 'none'
        ? 'border-transparent bg-transparent'
        : 'border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-background)_80%,var(--app-canvas-bg)_20%)] hover:border-[var(--app-muted)]/50 focus-within:border-[var(--app-accent)]',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <Icon
      v-if="icon"
      :icon="toIconify(icon)"
      class="ml-2 shrink-0 size-3.5 text-[var(--app-muted)] pointer-events-none"
    />
    <select
      :value="multiple ? undefined : modelValue ?? ''"
      :disabled="disabled"
      :multiple="multiple"
      :class="[
        'flex-1 min-w-0 bg-transparent text-[var(--app-foreground)] appearance-none outline-none cursor-pointer',
        'disabled:cursor-not-allowed',
        sizeClasses[size],
        icon ? 'pl-1 pr-6' : 'px-2.5 pr-6',
      ]"
      @change="onChange"
    >
      <option v-if="placeholder && !multiple" value="" disabled class="bg-[var(--app-background)]">{{ placeholder }}</option>
      <option
        v-for="opt in normalizedOptions"
        :key="String(opt.value)"
        :value="opt.value"
        :selected="multiple ? selectedValues.has(String(opt.value)) : undefined"
        :disabled="opt.disabled"
        class="bg-[var(--app-background)]"
      >
        {{ opt.label }}
      </option>
    </select>
    <Icon icon="lucide:chevron-down" class="absolute right-2 size-3 text-[var(--app-muted)] pointer-events-none" />
  </div>
</template>
