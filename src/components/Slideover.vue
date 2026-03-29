<script setup lang="ts">
/**
 * Slideover - Plain implementation (no reka-ui)
 */
import { useEscapeKey } from '../composables/useEscapeKey'

const props = withDefaults(defineProps<{
  open?: boolean
  title?: string
  side?: 'left' | 'right'
  preventClose?: boolean
}>(), {
  open: false,
  title: '',
  side: 'right',
  preventClose: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

function close() {
  if (props.preventClose) return
  emit('update:open', false)
  emit('close')
}

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

useEscapeKey(() => { if (props.open) close() })
</script>

<template>
  <Teleport to="body">
    <Transition name="slideover-overlay">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @mousedown="onOverlayClick"
      />
    </Transition>
    <Transition :name="side === 'left' ? 'slideover-left' : 'slideover-right'">
      <div
        v-if="open"
        :class="[
          'fixed z-50 h-full w-full max-w-md bg-[var(--app-background)] shadow-xl flex flex-col',
          side === 'left' ? 'left-0 top-0' : 'right-0 top-0',
        ]"
      >
        <div v-if="title" class="flex items-center justify-between px-4 py-3 border-b border-[var(--app-border)]">
          <h2 class="text-sm font-semibold text-[var(--app-foreground)]">{{ title }}</h2>
          <button
            v-if="!preventClose"
            class="rounded-sm opacity-70 transition-opacity hover:opacity-100 text-[var(--app-muted)]"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div class="flex-1 overflow-auto">
          <slot />
        </div>
        <div v-if="$slots.footer" class="px-4 py-3 border-t border-[var(--app-border)]">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.slideover-overlay-enter-active { transition: opacity 0.2s ease; }
.slideover-overlay-leave-active { transition: opacity 0.15s ease; }
.slideover-overlay-enter-from, .slideover-overlay-leave-to { opacity: 0; }

.slideover-right-enter-active, .slideover-right-leave-active { transition: transform 0.3s ease; }
.slideover-right-enter-from { transform: translateX(100%); }
.slideover-right-leave-to { transform: translateX(100%); }

.slideover-left-enter-active, .slideover-left-leave-active { transition: transform 0.3s ease; }
.slideover-left-enter-from { transform: translateX(-100%); }
.slideover-left-leave-to { transform: translateX(-100%); }
</style>
