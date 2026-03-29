<script setup lang="ts">
/**
 * Modal - Plain implementation (no reka-ui)
 * Supports: #header, #body, #footer, #trigger slots + title/description props
 */
import { useEscapeKey } from '../composables/useEscapeKey'

const props = withDefaults(defineProps<{
  open?: boolean
  title?: string
  description?: string
  fullscreen?: boolean
  preventClose?: boolean
  ui?: Record<string, string>
}>(), {
  open: false,
  title: '',
  description: '',
  fullscreen: false,
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
  <slot v-if="$slots.trigger" name="trigger" />
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" @mousedown="onOverlayClick">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Content -->
        <div
          :class="[
            'relative z-10 bg-[var(--app-background)] shadow-xl overflow-hidden flex flex-col',
            fullscreen
              ? 'inset-2 absolute rounded-xl'
              : ['rounded-lg border border-[var(--app-border)]', ui?.content || 'w-full max-w-lg max-h-[85vh]'],
          ]"
        >
          <!-- Header -->
          <div v-if="$slots.header || title || description" class="p-6 pb-0 shrink-0">
            <slot name="header">
              <div class="flex flex-col gap-1.5">
                <h2 v-if="title" class="text-lg font-semibold text-[var(--app-foreground)]">{{ title }}</h2>
                <p v-if="description" class="text-sm text-[var(--app-muted)]">{{ description }}</p>
              </div>
            </slot>
          </div>

          <!-- Body -->
          <div class="p-6 text-[var(--app-foreground)] flex-1 overflow-auto">
            <slot name="body">
              <slot name="content">
                <slot />
              </slot>
            </slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 pb-6 shrink-0">
            <slot name="footer" />
          </div>

          <!-- Close button -->
          <button
            v-if="!preventClose"
            class="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none text-[var(--app-muted)]"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-enter-active { transition: opacity 0.2s ease; }
.modal-leave-active { transition: opacity 0.15s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
