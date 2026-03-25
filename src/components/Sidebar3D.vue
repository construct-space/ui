<script setup lang="ts">
/**
 * Sidebar3D — Construct UI
 * 3D rotating dock sidebar with front + side panel.
 * 72px wide, CSS 3D cube rotation on space enter/exit.
 */

export interface SidebarItem {
  id: string
  icon: string
  label: string
  to?: string
  active?: boolean
  badge?: string | number
  color?: string
}

export interface SidebarSection {
  items: SidebarItem[]
  separator?: boolean
}

const props = withDefaults(defineProps<{
  /** Main panel sections (front face) */
  sections?: SidebarSection[]
  /** Side panel items (right face, shown when rotated) */
  sideItems?: SidebarItem[]
  /** Back button label for side panel */
  sideBackLabel?: string
  /** Whether the sidebar is rotated to show side panel */
  rotated?: boolean
  /** Logo slot or icon name */
  logoIcon?: string
  /** Avatar initials for bottom */
  avatar?: string
  /** Avatar active/menu state */
  avatarActive?: boolean
}>(), {
  sections: () => [],
  sideItems: () => [],
  sideBackLabel: 'Back',
  rotated: false,
  avatar: '',
  avatarActive: false,
})

const emit = defineEmits<{
  'item-click': [item: SidebarItem]
  'back': []
  'logo-click': []
  'avatar-click': []
}>()
</script>

<template>
  <aside class="w-[72px] flex flex-col items-center shrink-0 z-50 bg-transparent backdrop-blur-md border-r" style="border-color: var(--app-border)">
    <!-- Logo -->
    <div class="pt-12 pb-2 shrink-0 cursor-pointer" @click="emit('logo-click')">
      <slot name="logo">
        <div class="size-8 rounded-lg flex items-center justify-center" style="color: var(--app-accent)">
          <slot name="logo-icon" />
        </div>
      </slot>
    </div>

    <!-- 3D Cube Container -->
    <div class="flex-1 w-full overflow-hidden" style="perspective: 800px">
      <div
        class="relative w-full h-full transition-transform duration-500 ease-out"
        :style="{
          transformStyle: 'preserve-3d',
          transform: rotated ? 'rotateY(-90deg)' : 'rotateY(0deg)',
        }"
      >
        <!-- Front Face: Main nav -->
        <div
          class="absolute inset-0 w-full h-full flex flex-col items-center gap-1 pt-2 overflow-y-auto"
          style="backface-visibility: hidden; transform: translateZ(36px)"
        >
          <template v-for="(section, si) in sections" :key="si">
            <div v-if="section.separator && si > 0" class="w-8 border-t my-1" style="border-color: var(--app-border)" />
            <button
              v-for="item in section.items"
              :key="item.id"
              class="sidebar-btn relative"
              :class="item.active ? 'active' : ''"
              :style="item.active && item.color ? `--item-color: ${item.color}` : ''"
              :title="item.label"
              @click="emit('item-click', item)"
            >
              <component :is="'Icon'" :name="item.icon" class="size-5" />
              <span v-if="item.badge" class="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-[var(--app-accent)] text-[9px] font-bold text-white flex items-center justify-center">
                {{ item.badge }}
              </span>
            </button>
          </template>
        </div>

        <!-- Right Face: Side panel (space sub-pages) -->
        <div
          class="absolute inset-0 w-full h-full flex flex-col items-center gap-1 pt-2"
          style="backface-visibility: hidden; transform: rotateY(90deg) translateZ(36px)"
        >
          <!-- Back button -->
          <button
            class="sidebar-btn mb-2"
            :title="sideBackLabel"
            @click="emit('back')"
          >
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button
            v-for="item in sideItems"
            :key="item.id"
            class="sidebar-btn"
            :class="item.active ? 'active' : ''"
            :title="item.label"
            @click="emit('item-click', item)"
          >
            <component :is="'Icon'" :name="item.icon" class="size-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom: Avatar -->
    <div class="pb-4 pt-2 shrink-0 flex flex-col items-center gap-2">
      <slot name="bottom" />
      <button
        v-if="avatar"
        class="size-9 rounded-full flex items-center justify-center text-xs font-semibold transition-colors"
        :class="avatarActive ? 'bg-[var(--app-accent)] text-white' : 'bg-[var(--app-border)] text-[var(--app-foreground)] hover:bg-[var(--app-muted)]/20'"
        @click="emit('avatar-click')"
      >
        {{ avatar }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  background: transparent;
  color: var(--app-muted);
}
.sidebar-btn:hover {
  background: color-mix(in srgb, var(--app-muted) 10%, transparent);
  color: var(--app-foreground);
}
.sidebar-btn.active {
  background: color-mix(in srgb, var(--item-color, var(--app-accent)) 15%, transparent);
  color: var(--item-color, var(--app-accent));
}
</style>
