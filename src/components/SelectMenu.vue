<script setup lang="ts">
/**
 * SelectMenu - Nuxt UI v3 compatible searchable select
 */
import { Icon } from '@iconify/vue'

export interface SelectOption {
  label: string
  value?: string | number | null
  icon?: string
  disabled?: boolean
  description?: string
  type?: string
  [key: string]: unknown
}

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  options?: SelectOption[] | string[]
  items?: SelectOption[] | SelectOption[][] | string[]
  placeholder?: string
  searchable?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string
  variant?: 'outline' | 'soft' | 'none'
  valueAttribute?: string
  valueKey?: string
  optionAttribute?: string
}>(), {
  modelValue: null,
  options: () => [],
  placeholder: 'Select...',
  searchable: false,
  size: 'md',
  disabled: false,
  valueAttribute: 'value',
  optionAttribute: 'label',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
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
  const raw = props.items?.length ? props.items : props.options
  if (!raw) return []
  // Flatten grouped arrays
  const flat: (SelectOption | string)[] = []
  for (const item of raw) {
    if (Array.isArray(item)) {
      flat.push(...(item as (SelectOption | string)[]))
    } else {
      flat.push(item as SelectOption | string)
    }
  }
  return flat.map(opt => {
    if (typeof opt === 'string') return { label: opt, value: opt }
    return opt as SelectOption
  })
})

const selectedLabel = computed(() => {
  const opt = normalizedOptions.value.find(o => o.value === props.modelValue)
  return opt?.label || ''
})

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const contentStyle = ref<{ top: string; left: string; minWidth: string }>({ top: '0px', left: '0px', minWidth: '0px' })
const highlightedIndex = ref(-1)

function positionContent() {
  nextTick(() => {
    const triggerEl = triggerRef.value
    const contentEl = contentRef.value
    if (!triggerEl || !contentEl) return
    const rect = triggerEl.getBoundingClientRect()
    const contentRect = contentEl.getBoundingClientRect()
    let top = rect.bottom + 4
    let left = rect.left
    if (top + contentRect.height > window.innerHeight - 8) {
      top = rect.top - contentRect.height - 4
    }
    if (left + contentRect.width > window.innerWidth - 8) {
      left = window.innerWidth - contentRect.width - 8
    }
    if (left < 8) left = 8
    contentStyle.value = { top: `${top}px`, left: `${left}px`, minWidth: `${rect.width}px` }
  })
}

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightedIndex.value = -1
    positionContent()
    nextTick(() => {
      document.addEventListener('mousedown', onClickOutside)
      document.addEventListener('keydown', onKeydown)
    })
  } else {
    cleanup()
  }
}

function close() {
  isOpen.value = false
  cleanup()
}

function cleanup() {
  document.removeEventListener('mousedown', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
}

function onClickOutside(e: MouseEvent) {
  if (triggerRef.value?.contains(e.target as Node)) return
  if (contentRef.value?.contains(e.target as Node)) return
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
    return
  }
  const opts = normalizedOptions.value
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, opts.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  } else if (e.key === 'Enter' && highlightedIndex.value >= 0) {
    e.preventDefault()
    const opt = opts[highlightedIndex.value]
    if (opt && !opt.disabled) {
      selectOption(opt)
    }
  }
}

function selectOption(opt: SelectOption) {
  const val = String(opt.value)
  emit('update:modelValue', val)
  emit('change', val)
  close()
}

onUnmounted(cleanup)

const sizeClasses: Record<string, string> = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}
</script>

<template>
  <div ref="triggerRef" class="inline-flex w-full">
    <button
      type="button"
      :disabled="disabled"
      :class="[
        'inline-flex items-center justify-between gap-2 w-full rounded-md border border-[var(--app-border)] bg-[var(--app-background)] text-[var(--app-foreground)]',
        'focus:border-[var(--app-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
      ]"
      @click="toggle"
    >
      <div class="flex items-center gap-2 truncate">
        <Icon v-if="icon" :icon="toIconify(icon)" class="size-4 shrink-0 text-[var(--app-muted)]" />
        <span :class="selectedLabel ? 'text-[var(--app-foreground)]' : 'text-[var(--app-muted)]'">
          {{ selectedLabel || placeholder }}
        </span>
      </div>
      <Icon icon="lucide:chevron-down" class="size-3.5 shrink-0 opacity-50" />
    </button>
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="contentRef"
      :style="{ position: 'fixed', ...contentStyle }"
      class="z-[100] overflow-hidden rounded-lg border border-[var(--app-border)] bg-[var(--app-background)] shadow-xl"
    >
      <div class="p-1 max-h-64 overflow-y-auto">
        <div
          v-for="(opt, idx) in normalizedOptions"
          :key="String(opt.value)"
          :class="[
            'relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[var(--app-foreground)] outline-none cursor-pointer select-none',
            'hover:bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)] hover:text-[var(--app-accent)]',
            idx === highlightedIndex ? 'bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)] text-[var(--app-accent)]' : '',
            opt.disabled ? 'pointer-events-none opacity-50' : '',
          ]"
          @click="!opt.disabled && selectOption(opt)"
          @mouseenter="highlightedIndex = idx"
        >
          <span class="w-5 shrink-0 flex items-center justify-center">
            <Icon v-if="String(opt.value) === String(modelValue)" icon="lucide:check" class="size-3.5" />
          </span>
          <div class="flex items-center gap-2">
            <Icon v-if="opt.icon" :icon="toIconify(opt.icon)" class="size-4 shrink-0" />
            <span>{{ opt.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
