<script setup lang="ts">
// Single inbox notification card. Render one per row in the bell / inbox.
// Pairs with SDK `useNotification()` which feeds the items.
//
//   <Notification
//     v-for="n in notifications"
//     :key="n.id"
//     :title="n.title"
//     :body="n.body"
//     :time="n.created_at"
//     :read="n.read_at != null"
//     :icon="n.type"
//     @click="open(n)"
//     @dismiss="dismiss(n.id)"
//   />

interface Props {
  title: string
  body?: string
  /** ISO date string or Date — rendered as relative time ("2m", "1h"). */
  time?: string | Date
  /** Read state; unread items show an accent dot. */
  read?: boolean
  /** Optional notification type label (chat.mention, board.assigned). */
  icon?: string
  /** When true, swallows the dismiss button (e.g. system notifications). */
  pinned?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  read: false,
  pinned: false,
})

const emit = defineEmits<{
  click: []
  dismiss: []
}>()

function formatTime(time?: string | Date): string {
  if (!time) return ''
  const date = typeof time === 'string' ? new Date(time) : time
  const diff = Date.now() - date.getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return date.toLocaleDateString()
}
</script>

<template>
  <button
    type="button"
    class="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-sm transition-colors cursor-pointer"
    :class="[
      props.read
        ? 'bg-transparent hover:bg-[var(--app-muted)]/5'
        : 'bg-[color-mix(in_srgb,var(--app-accent)_6%,transparent)] hover:bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)]',
    ]"
    @click="emit('click')"
  >
    <span
      class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
      :class="props.read ? 'bg-transparent' : 'bg-[var(--app-accent)]'"
    />

    <div class="flex-1 min-w-0">
      <div class="flex items-baseline gap-2">
        <p class="text-sm font-medium text-[var(--app-foreground)] truncate flex-1">
          {{ props.title }}
        </p>
        <span v-if="props.time" class="text-[11px] text-[var(--app-muted)] shrink-0">
          {{ formatTime(props.time) }}
        </span>
      </div>
      <p v-if="props.body" class="mt-0.5 text-xs text-[var(--app-muted)] line-clamp-2">
        {{ props.body }}
      </p>
      <p v-if="props.icon" class="mt-1 text-[10px] tracking-[0.08em] uppercase text-[var(--app-muted)]">
        {{ props.icon }}
      </p>
    </div>

    <button
      v-if="!props.pinned"
      type="button"
      class="shrink-0 mt-1 rounded-sm text-[var(--app-muted)] hover:text-[var(--app-foreground)] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
      @click.stop="emit('dismiss')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </button>
</template>
