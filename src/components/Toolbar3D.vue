<script setup lang="ts">
/**
 * Toolbar3D — Construct UI
 * 3D rotating toolbar that flips on page transitions.
 * Rounded-right-only, inset margins, surface background.
 */

export interface ToolbarAction {
  id: string
  icon: string
  label: string
  active?: boolean
  disabled?: boolean
}

export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

const props = withDefaults(defineProps<{
  breadcrumbs?: BreadcrumbItem[]
  actions?: ToolbarAction[]
  nextBreadcrumbs?: BreadcrumbItem[]
  nextActions?: ToolbarAction[]
  rotating?: boolean
  spaceIcon?: string
  spaceColor?: string
}>(), {
  breadcrumbs: () => [],
  actions: () => [],
  nextBreadcrumbs: () => [],
  nextActions: () => [],
  rotating: false,
})

const emit = defineEmits<{
  'action-click': [action: ToolbarAction]
  'breadcrumb-click': [crumb: BreadcrumbItem]
}>()

function actionBtnClass(action: ToolbarAction): string {
  const base = 'inline-flex items-center justify-center size-8 rounded-md cursor-pointer transition-all duration-150 border-none'
  if (action.disabled) return `${base} opacity-40 cursor-not-allowed text-[var(--app-muted)] bg-transparent`
  if (action.active) return `${base} bg-[color-mix(in_srgb,var(--app-accent)_15%,transparent)] text-[var(--app-accent)]`
  return `${base} bg-transparent text-[var(--app-muted)] hover:bg-[color-mix(in_srgb,var(--app-muted)_10%,transparent)] hover:text-[var(--app-foreground)]`
}

const panelStyle = { backfaceVisibility: 'hidden' as const, transform: 'translateZ(22px)' }
const bottomPanelStyle = { backfaceVisibility: 'hidden' as const, transform: 'rotateX(-90deg) translateZ(22px)' }
</script>

<template>
  <div class="relative h-11 select-none ml-[22px] mr-[22px] mt-3" style="perspective: 1000px" @contextmenu.prevent>
    <div
      class="w-full h-full relative"
      :class="rotating ? 'transition-transform duration-500 ease-in' : ''"
      :style="{ transformStyle: 'preserve-3d', transform: rotating ? 'rotateX(-90deg)' : 'rotateX(0deg)' }"
    >
      <!-- Front Panel -->
      <div class="absolute inset-0 w-full h-11 px-4 flex items-center gap-2 rounded-r-xl border border-[var(--app-border)] bg-[var(--app-surface,var(--app-card-bg))]" :style="panelStyle">
        <!-- Space icon -->
        <div v-if="spaceIcon" class="size-5 rounded flex items-center justify-center shrink-0" :style="`background: color-mix(in srgb, ${spaceColor || 'var(--app-accent)'} 15%, transparent)`">
          <slot name="space-icon">
            <component :is="'Icon'" :name="spaceIcon" class="size-3.5" :style="`color: ${spaceColor || 'var(--app-accent)'}`" />
          </slot>
        </div>

        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1.5 text-sm ml-1">
          <template v-for="(crumb, i) in breadcrumbs" :key="i">
            <svg v-if="i > 0" class="size-3 shrink-0 text-[var(--app-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            <button
              v-if="crumb.to"
              class="text-[var(--app-muted)] hover:underline transition-colors"
              @click="emit('breadcrumb-click', crumb)"
            >{{ crumb.label }}</button>
            <span v-else class="font-medium text-[var(--app-foreground)]">{{ crumb.label }}</span>
          </template>
        </nav>

        <slot name="left" />
        <div class="flex-1" />
        <slot name="center" />
        <div class="flex-1" />

        <!-- Action buttons -->
        <template v-if="actions.length">
          <div class="w-px h-5 bg-[var(--app-border)]" />
          <div class="flex items-center gap-0.5">
            <button
              v-for="action in actions"
              :key="action.id"
              :class="actionBtnClass(action)"
              :disabled="action.disabled"
              :title="action.label"
              @click="emit('action-click', action)"
            >
              <component :is="'Icon'" :name="action.icon" class="size-4" />
            </button>
          </div>
        </template>

        <slot name="right" />
      </div>

      <!-- Bottom Panel (rotation target) -->
      <div class="absolute inset-0 w-full h-11 px-4 flex items-center gap-2 rounded-r-xl border border-[var(--app-border)] bg-[var(--app-surface,var(--app-card-bg))]" :style="bottomPanelStyle">
        <nav class="flex items-center gap-1.5 text-sm ml-1">
          <template v-for="(crumb, i) in nextBreadcrumbs" :key="i">
            <svg v-if="i > 0" class="size-3 shrink-0 text-[var(--app-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            <span :class="i === nextBreadcrumbs.length - 1 ? 'font-medium text-[var(--app-foreground)]' : 'text-[var(--app-muted)]'">{{ crumb.label }}</span>
          </template>
        </nav>
        <div class="flex-1" />
        <template v-if="nextActions.length">
          <div class="w-px h-5 bg-[var(--app-border)]" />
          <div class="flex items-center gap-0.5">
            <button v-for="action in nextActions" :key="action.id" :class="actionBtnClass(action)" :title="action.label">
              <component :is="'Icon'" :name="action.icon" class="size-4" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
