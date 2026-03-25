<script setup lang="ts">
/**
 * SidebarLayout - 60px icon sidebar used by billing, delivery, and other infra services.
 *
 * Provides: fixed left sidebar with icon nav, tooltip on hover, user avatar dropdown at bottom.
 * Consumers pass nav items and user info as props.
 */
import { ref, computed } from 'vue'

export interface NavItem {
  icon: string
  label: string
  to: string
  active?: boolean
}

const props = withDefaults(defineProps<{
  navItems?: NavItem[]
  serviceName?: string
  serviceIcon?: string
  userName?: string
  userAvatar?: string
  accentColor?: string
}>(), {
  navItems: () => [],
  serviceName: '',
  serviceIcon: '',
  userName: '',
  userAvatar: '',
  accentColor: '#FF2D55',
})

const emit = defineEmits<{
  (e: 'navigate', to: string): void
  (e: 'logout'): void
}>()

const showUserMenu = ref(false)
const hoveredNav = ref<string | null>(null)

const initials = computed(() => {
  if (!props.userName) return '?'
  return props.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<template>
  <div class="cui-sidebar-layout">
    <aside class="cui-sidebar">
      <!-- Logo -->
      <div class="cui-sidebar-logo">
        <slot name="logo">
          <span v-if="serviceIcon" v-html="serviceIcon" />
          <span v-else class="cui-sidebar-logo-text">C</span>
        </slot>
      </div>

      <!-- Navigation -->
      <nav class="cui-sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.to"
          class="cui-sidebar-nav-item"
          :class="{ active: item.active }"
          @click="emit('navigate', item.to)"
          @mouseenter="hoveredNav = item.to"
          @mouseleave="hoveredNav = null"
        >
          <span v-html="item.icon" />
          <div v-if="hoveredNav === item.to" class="cui-sidebar-tooltip">
            {{ item.label }}
          </div>
        </div>
      </nav>

      <!-- User -->
      <div class="cui-sidebar-user">
        <div
          class="cui-sidebar-avatar"
          :style="{ background: accentColor }"
          @click="showUserMenu = !showUserMenu"
        >
          <img v-if="userAvatar" :src="userAvatar" :alt="userName" />
          <span v-else>{{ initials }}</span>
        </div>
        <div v-if="showUserMenu" class="cui-sidebar-user-menu">
          <slot name="user-menu">
            <div class="cui-sidebar-user-menu-item" @click="emit('logout')">
              Sign out
            </div>
          </slot>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="cui-sidebar-main">
      <slot />
    </main>
  </div>
</template>

<style>
.cui-sidebar-layout {
  display: flex;
  min-height: 100vh;
}

.cui-sidebar {
  width: 60px;
  background: var(--app-background, #18181b);
  border-right: 1px solid var(--app-border, #27272a);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.cui-sidebar-logo {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
  color: var(--app-foreground, #fafafa);
}

.cui-sidebar-logo-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.cui-sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.cui-sidebar-nav-item {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  color: var(--app-muted, #71717a);
  transition: all 0.15s;
}

.cui-sidebar-nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--app-foreground, #fafafa);
}

.cui-sidebar-nav-item.active {
  color: var(--app-accent, #FF2D55);
  background: rgba(255, 255, 255, 0.06);
}

.cui-sidebar-tooltip {
  position: absolute;
  left: 52px;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px 10px;
  background: var(--app-foreground, #fafafa);
  color: var(--app-background, #18181b);
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 200;
}

.cui-sidebar-user {
  position: relative;
}

.cui-sidebar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
}

.cui-sidebar-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cui-sidebar-user-menu {
  position: absolute;
  left: 52px;
  bottom: 0;
  background: var(--app-background, #18181b);
  border: 1px solid var(--app-border, #27272a);
  border-radius: 8px;
  min-width: 160px;
  padding: 4px;
  z-index: 200;
}

.cui-sidebar-user-menu-item {
  padding: 8px 12px;
  font-size: 13px;
  color: var(--app-foreground, #fafafa);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}

.cui-sidebar-user-menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.cui-sidebar-main {
  flex: 1;
  margin-left: 60px;
  min-height: 100vh;
}
</style>
