<script setup lang="ts">
/**
 * DatePicker — Construct UI
 * Input with calendar dropdown for date selection.
 *
 * The trigger is a real text input (when `typeable`, default true) that accepts:
 *   YYYY-MM-DD     1982-06-07
 *   MM/DD/YYYY     6/7/1982
 *   MM-DD-YYYY     6-7-1982
 *   MM/DD/YY       6/7/82
 *
 * 2-digit years pivot at currentYear+10:
 *   yy ≤ pivot → 20yy   (e.g. "26" → 2026)
 *   yy >  pivot → 19yy  (e.g. "82" → 1982)
 *
 * Parsing respects `min` / `max`. Pressing Enter or blurring commits a valid
 * value; Escape reverts to the last committed value. Clicking the calendar
 * icon opens the picker; clicking the input itself just focuses, so users can
 * type without the dropdown stealing focus.
 */
import { Icon } from '@iconify/vue'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  min?: string
  max?: string
  format?: 'iso' | 'locale'
  /** Accept typed text input (default true). Set false for click-only behavior. */
  typeable?: boolean
}>(), {
  modelValue: null,
  placeholder: 'MM/DD/YYYY',
  size: 'md',
  disabled: false,
  format: 'iso',
  typeable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const open = ref(false)
const viewDate = ref(new Date())
const inputEl = ref<HTMLInputElement | null>(null)
const inputText = ref('')

const selectedDate = computed(() => props.modelValue ? new Date(props.modelValue) : null)

function formatForDisplay(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return props.format === 'locale' ? d.toLocaleDateString() : d.toISOString().split('T')[0]
}

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  return formatForDisplay(props.modelValue)
})

// Sync the input text whenever the model value changes externally.
watch(() => props.modelValue, () => { inputText.value = displayValue.value }, { immediate: true })

// Sync the calendar view to the selected date.
watch(selectedDate, (d) => { if (d) viewDate.value = new Date(d) }, { immediate: true })

const monthYear = computed(() =>
  viewDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6

  const days: { date: Date; current: boolean; disabled: boolean }[] = []

  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, current: false, disabled: true })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i)
    let disabled = false
    if (props.min && d < new Date(props.min)) disabled = true
    if (props.max && d > new Date(props.max)) disabled = true
    days.push({ date: d, current: true, disabled })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    days.push({ date: d, current: false, disabled: true })
  }

  return days
})

function isSelected(date: Date): boolean {
  if (!selectedDate.value) return false
  return date.toDateString() === selectedDate.value.toDateString()
}
function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString()
}

function selectDay(day: { date: Date; disabled: boolean }) {
  if (day.disabled) return
  const iso = day.date.toISOString().split('T')[0]
  emit('update:modelValue', iso)
  inputText.value = formatForDisplay(iso)
  open.value = false
}

function prevMonth() { viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1) }
function nextMonth() { viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1) }

function clear() {
  emit('update:modelValue', null)
  inputText.value = ''
}

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
}

// ── Typed-input parsing ────────────────────────────────────────────────────
function buildIsoSafe(y: number, mo: number, d: number): string | null {
  if (y < 1 || mo < 1 || mo > 12 || d < 1 || d > 31) return null
  const dt = new Date(y, mo - 1, d)
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null
  const yyyy = String(y).padStart(4, '0')
  const mm = String(mo).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function inRange(iso: string): boolean {
  if (props.min && iso < props.min) return false
  if (props.max && iso > props.max) return false
  return true
}

function parseTyped(raw: string): string | null {
  const s = raw.trim()
  if (!s) return null

  // ISO
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (m) {
    const iso = buildIsoSafe(+m[1], +m[2], +m[3])
    return iso && inRange(iso) ? iso : null
  }

  // 4-digit year
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (m) {
    const iso = buildIsoSafe(+m[3], +m[1], +m[2])
    return iso && inRange(iso) ? iso : null
  }

  // 2-digit year — pivot at currentYear+10
  m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/)
  if (m) {
    const mo = +m[1], d = +m[2], yy = +m[3]
    const pivot = (new Date().getFullYear() % 100) + 10
    const candidates = yy <= pivot ? [2000 + yy, 1900 + yy] : [1900 + yy, 2000 + yy]
    for (const y of candidates) {
      const iso = buildIsoSafe(y, mo, d)
      if (iso && inRange(iso)) return iso
    }
  }

  return null
}

function onInput(ev: Event) {
  inputText.value = (ev.target as HTMLInputElement).value
}

function commitTyped() {
  if (!props.typeable) return
  const txt = inputText.value
  if (!txt.trim()) {
    if (props.modelValue !== null) emit('update:modelValue', null)
    return
  }
  const iso = parseTyped(txt)
  if (iso) {
    if (iso !== props.modelValue) emit('update:modelValue', iso)
    inputText.value = formatForDisplay(iso)
  } else {
    // Invalid — revert to last good display
    inputText.value = displayValue.value
  }
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Enter') {
    ev.preventDefault()
    commitTyped()
    open.value = false
  } else if (ev.key === 'Escape') {
    ev.preventDefault()
    inputText.value = displayValue.value
    open.value = false
    inputEl.value?.blur()
  }
}

function onInputFocus() {
  // Don't auto-open the dropdown — typing should be unobstructed.
  // Select-all so a partial date can be replaced quickly.
  setTimeout(() => inputEl.value?.select(), 0)
}

const sizeClasses: Record<string, string> = { xs: 'py-0.5 text-xs', sm: 'py-1 text-xs', md: 'py-1.5 text-sm', lg: 'py-2 text-base' }
</script>

<template>
  <div class="relative w-full">
    <div
      class="relative inline-flex items-center w-full rounded-md border transition-colors duration-150 overflow-hidden"
      :class="[
        'border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-background)_80%,var(--app-canvas-bg)_20%)]',
        open ? 'border-[var(--app-accent)]' : 'hover:border-[var(--app-muted)]/50',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
    >
      <button
        type="button"
        class="ml-1.5 p-1 rounded text-[var(--app-muted)] hover:text-[var(--app-foreground)] disabled:cursor-not-allowed"
        :disabled="disabled"
        :title="open ? 'Close calendar' : 'Open calendar'"
        @click="toggleOpen"
      >
        <Icon icon="lucide:calendar" class="size-3.5" />
      </button>

      <input
        v-if="typeable"
        ref="inputEl"
        :value="inputText"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'flex-1 px-2 bg-transparent outline-none',
          sizeClasses[size],
          modelValue || inputText ? 'text-[var(--app-foreground)]' : 'text-[var(--app-muted)]/50',
        ]"
        autocomplete="off"
        spellcheck="false"
        inputmode="numeric"
        @input="onInput"
        @blur="commitTyped"
        @keydown="onKeydown"
        @focus="onInputFocus"
      />
      <span
        v-else
        :class="['flex-1 px-2.5 truncate cursor-pointer', sizeClasses[size], modelValue ? 'text-[var(--app-foreground)]' : 'text-[var(--app-muted)]/50']"
        @click="toggleOpen"
      >
        {{ displayValue || placeholder }}
      </span>

      <button
        v-if="modelValue"
        type="button"
        class="mr-1 p-0.5 rounded text-[var(--app-muted)] hover:text-[var(--app-foreground)]"
        title="Clear"
        @click.stop="clear"
      >
        <Icon icon="lucide:x" class="size-3" />
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0 -translate-y-1"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute z-50 mt-1 w-64 rounded-lg border border-[var(--app-border)] bg-[var(--app-card-bg)] shadow-lg p-3"
        @click.stop
      >
        <div class="flex items-center justify-between mb-2">
          <button class="p-1 rounded hover:bg-[var(--app-card-hover)] text-[var(--app-muted)]" @click="prevMonth">
            <Icon icon="lucide:chevron-left" class="size-4" />
          </button>
          <span class="text-sm font-medium text-[var(--app-foreground)]">{{ monthYear }}</span>
          <button class="p-1 rounded hover:bg-[var(--app-card-hover)] text-[var(--app-muted)]" @click="nextMonth">
            <Icon icon="lucide:chevron-right" class="size-4" />
          </button>
        </div>

        <div class="grid grid-cols-7 gap-0.5 mb-1">
          <div v-for="d in weekDays" :key="d" class="text-center text-[10px] font-medium text-[var(--app-muted)] py-1">{{ d }}</div>
        </div>

        <div class="grid grid-cols-7 gap-0.5">
          <button
            v-for="(day, i) in calendarDays"
            :key="i"
            class="size-8 rounded text-xs transition-colors"
            :class="[
              isSelected(day.date) ? 'bg-[var(--app-accent)] text-[var(--app-accent-foreground)] font-medium' :
              isToday(day.date) && day.current ? 'bg-[color-mix(in_srgb,var(--app-accent)_15%,transparent)] text-[var(--app-accent)]' :
              day.current && !day.disabled ? 'text-[var(--app-foreground)] hover:bg-[var(--app-card-hover)]' :
              'text-[var(--app-muted)]/30',
              day.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ]"
            :disabled="day.disabled"
            @click="selectDay(day)"
          >
            {{ day.date.getDate() }}
          </button>
        </div>

        <p class="mt-2 text-[10px] text-[var(--app-muted)]/70 text-center">
          Tip: type <span class="font-mono">MM/DD/YYYY</span> or <span class="font-mono">M/D/YY</span> in the input.
        </p>
      </div>
    </Transition>
  </div>
</template>
