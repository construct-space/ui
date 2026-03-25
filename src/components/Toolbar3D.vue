<script setup lang="ts">
/**
 * Toolbar3D — Construct UI
 * 3D rotating toolbar that flips on page transitions.
 * Shows breadcrumb + action buttons on front, new page content on bottom.
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
  /** Breadcrumb items for front panel */
  breadcrumbs?: BreadcrumbItem[]
  /** Action buttons on the right */
  actions?: ToolbarAction[]
  /** Next page breadcrumbs (bottom panel, shown during rotation) */
  nextBreadcrumbs?: BreadcrumbItem[]
  /** Next page actions */
  nextActions?: ToolbarAction[]
  /** Whether currently rotating */
  rotating?: boolean
  /** Space icon to show before breadcrumbs */
  spaceIcon?: string
  /** Space accent color */
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
</script>

<template>
  <div class="relative h-11 select-none ml-[22px] mr-[22px] mt-3 perspective-[1000px]" @contextmenu.prevent>
    <div
      class="w-full h-full relative transform-3d"
      :class="rotating ? 'transition-transform duration-500 ease-in' : ''"
      :style="{ transform: rotating ? 'rotateX(-90deg)' : 'rotateX(0deg)' }"
    >
      <!-- Front Panel -->
      <div class="toolbar-panel absolute inset-0 w-full h-11 px-4 flex items-center gap-2 rounded-r-xl border bg-[var(--app-card-bg)]" style="border-color: var(--app-border)">
        <!-- Space icon -->
        <div v-if="spaceIcon" class="size-5 rounded flex items-center justify-center shrink-0" :style="`background: color-mix(in srgb, ${spaceColor || 'var(--app-accent)'} 15%, transparent)`">
          <component :is="'Icon'" :name="spaceIcon" class="size-3.5" :style="`color: ${spaceColor || 'var(--app-accent)'}`" />
        </div>

        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1.5 text-sm">
          <template v-for="(crumb, i) in breadcrumbs" :key="i">
            <svg v-if="i > 0" class="size-3 shrink-0" style="color: var(--app-muted)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            <button
              v-if="crumb.to"
              class="hover:underline transition-colors"
              style="color: var(--app-muted)"
              @click="emit('breadcrumb-click', crumb)"
            >{{ crumb.label }}</button>
            <span v-else class="font-medium" style="color: var(--app-foreground)">{{ crumb.label }}</span>
          </template>
        </nav>

        <slot name="left" />
        <div class="flex-1" />
        <slot name="center" />
        <div class="flex-1" />

        <!-- Action buttons -->
        <template v-if="actions.length">
          <div class="w-px h-5" style="background: var(--app-border)" />
          <div class="flex items-center gap-0.5">
            <button
              v-for="action in actions"
              :key="action.id"
              class="toolbar-btn"
              :class="action.active ? 'active' : ''"
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
      <div class="toolbar-panel toolbar-panel--bottom absolute inset-0 w-full h-11 px-4 flex items-center gap-2 rounded-r-xl border bg-[var(--app-card-bg)]" style="border-color: var(--app-border)">
        <nav class="flex items-center gap-1.5 text-sm">
          <template v-for="(crumb, i) in nextBreadcrumbs" :key="i">
            <svg v-if="i > 0" class="size-3 shrink-0" style="color: var(--app-muted)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            <span :style="i === nextBreadcrumbs.length - 1 ? 'color: var(--app-foreground); font-weight: 500' : 'color: var(--app-muted)'">{{ crumb.label }}</span>
          </template>
        </nav>
        <div class="flex-1" />
        <template v-if="nextActions.length">
          <div class="w-px h-5" style="background: var(--app-border)" />
          <div class="flex items-center gap-0.5">
            <button v-for="action in nextActions" :key="action.id" class="toolbar-btn" :class="action.active ? 'active' : ''" :title="action.label">
              <component :is="'Icon'" :name="action.icon" class="size-4" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar-panel {
  backface-visibility: hidden;
  transform: translateZ(22px);
}
.toolbar-panel--bottom {
  transform: rotateX(-90deg) translateZ(22px);
}
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  background: transparent;
  color: var(--app-muted);
}
.toolbar-btn:hover {
  background: var(--app-input-bg, color-mix(in srgb, var(--app-muted) 10%, transparent));
  color: var(--app-foreground);
}
.toolbar-btn.active {
  background: color-mix(in srgb, var(--app-accent) 15%, transparent);
  color: var(--app-accent);
}
.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
