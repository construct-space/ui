<script setup lang="ts">
/**
 * HeaderLayout - Top header bar layout used by domains and other public-facing services.
 */
import { computed } from 'vue'

export interface HeaderNavItem {
  label: string
  to: string
  active?: boolean
}

const props = withDefaults(defineProps<{
  serviceName?: string
  navItems?: HeaderNavItem[]
  userName?: string
  userAvatar?: string
  accentColor?: string
  showAuth?: boolean
}>(), {
  serviceName: '',
  navItems: () => [],
  userName: '',
  userAvatar: '',
  accentColor: '#FF2D55',
  showAuth: true,
})

const emit = defineEmits<{
  (e: 'navigate', to: string): void
  (e: 'login'): void
  (e: 'logout'): void
}>()

const initials = computed(() => {
  if (!props.userName) return '?'
  return props.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>

<template>
  <div class="cui-header-layout">
    <header class="cui-header">
      <div class="cui-header-container">
        <div class="cui-header-left">
          <slot name="logo">
            <span class="cui-header-logo" @click="emit('navigate', '/')">
              construct <span class="cui-header-logo-sub">/ {{ serviceName }}</span>
            </span>
          </slot>
          <nav v-if="navItems.length" class="cui-header-nav">
            <a
              v-for="item in navItems"
              :key="item.to"
              :class="{ active: item.active }"
              @click.prevent="emit('navigate', item.to)"
            >
              {{ item.label }}
            </a>
          </nav>
        </div>
        <div class="cui-header-right">
          <slot name="actions" />
          <div v-if="showAuth && userName" class="cui-header-avatar" :style="{ background: accentColor }" @click="emit('logout')">
            <img v-if="userAvatar" :src="userAvatar" :alt="userName" />
            <span v-else>{{ initials }}</span>
          </div>
          <button v-else-if="showAuth" class="cui-header-signin" @click="emit('login')">
            Sign in
          </button>
        </div>
      </div>
    </header>
    <main class="cui-header-main">
      <slot />
    </main>
  </div>
</template>

<style>
.cui-header-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.cui-header {
  border-bottom: 1px solid var(--app-border, #27272a);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(18, 18, 30, 0.92);
  backdrop-filter: blur(16px);
}

.cui-header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cui-header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.cui-header-logo {
  font-size: 16px;
  font-weight: 700;
  color: var(--app-foreground, #fafafa);
  cursor: pointer;
  letter-spacing: 0.02em;
}

.cui-header-logo-sub {
  color: var(--app-muted, #71717a);
  font-weight: 400;
}

.cui-header-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cui-header-nav a {
  font-size: 13px;
  color: var(--app-muted, #71717a);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s;
}

.cui-header-nav a:hover,
.cui-header-nav a.active {
  color: var(--app-foreground, #fafafa);
}

.cui-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cui-header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
}

.cui-header-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cui-header-signin {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  background: var(--app-accent, #FF2D55);
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.cui-header-signin:hover {
  opacity: 0.9;
}

.cui-header-main {
  flex: 1;
}
</style>
