<script setup lang="ts">
/**
 * Tabs - Plain implementation (no reka-ui)
 *
 * Variants
 *  - line       1px foreground underline, sliding indicator
 *  - segmented  lifted pill, sliding indicator
 */
import {
  Comment,
  Fragment,
  Text,
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Component,
  type PropType,
  type Slot,
  type VNode,
  useSlots,
} from 'vue'
import Tab from './Tab.vue'

export interface TabItem {
  label: string
  value: string
  icon?: string | Component
  disabled?: boolean
}

interface ResolvedTab {
  label: string
  value: string
  icon?: string | Component
  disabled?: boolean
  content?: Slot
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    items?: TabItem[]
    variant?: 'line' | 'segmented'
  }>(),
  {
    modelValue: '',
    items: () => [],
    variant: 'line',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const slots = useSlots()

const SlotContent = defineComponent({
  name: 'ConstructTabsSlotContent',
  props: {
    render: {
      type: Function as PropType<Slot>,
      required: true,
    },
  },
  setup(innerProps) {
    return () => innerProps.render()
  },
})

function flattenNodes(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Comment || node.type === Text) return []
    if (node.type === Fragment && Array.isArray(node.children)) {
      return flattenNodes(node.children as VNode[])
    }
    return [node]
  })
}

function isTabNode(node: VNode) {
  const type = node.type as Component & { __name?: string; name?: string }
  return type === Tab || type?.name === 'ConstructTab' || type?.__name === 'ConstructTab'
}

const slotTabs = computed<ResolvedTab[]>(() => {
  const nodes = flattenNodes(slots.default?.() ?? [])
  return nodes.flatMap((node) => {
    if (!isTabNode(node)) return []

    const nodeProps = (node.props ?? {}) as {
      label?: string
      value?: string
      icon?: string | Component
      disabled?: boolean
    }

    if (!nodeProps.label || !nodeProps.value) return []

    const content = typeof node.children === 'object' && node.children && 'default' in node.children
      ? (node.children as { default?: Slot }).default
      : undefined

    return [{
      label: nodeProps.label,
      value: nodeProps.value,
      icon: nodeProps.icon,
      disabled: nodeProps.disabled,
      content,
    }]
  })
})

const resolvedTabs = computed<ResolvedTab[]>(() => {
  if (slotTabs.value.length > 0) return slotTabs.value
  return props.items
})

// ── Animated indicator ──
const listEl = ref<HTMLDivElement | null>(null)
const triggerRefs = ref<HTMLButtonElement[]>([])
const indicator = ref({ left: 0, width: 0, visible: false })

function setTriggerRef(el: Element | null | import('vue').ComponentPublicInstance) {
  if (el && 'tagName' in el) triggerRefs.value.push(el as HTMLButtonElement)
}

function updateIndicator() {
  const activeIndex = resolvedTabs.value.findIndex((t) => t.value === props.modelValue)
  if (activeIndex < 0) {
    indicator.value.visible = false
    return
  }
  const el = triggerRefs.value[activeIndex]
  if (!el || !listEl.value) {
    indicator.value.visible = false
    return
  }
  indicator.value = {
    left: el.offsetLeft,
    width: el.offsetWidth,
    visible: true,
  }
}

let ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  updateIndicator()
  if (typeof ResizeObserver !== 'undefined' && listEl.value) {
    ro = new ResizeObserver(() => updateIndicator())
    ro.observe(listEl.value)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
})

watch(
  () => [props.modelValue, resolvedTabs.value.length],
  async () => {
    await nextTick()
    updateIndicator()
  }
)

// Reset refs array before each render pass
function resetRefs() {
  triggerRefs.value = []
}

// ── Styling ──
const listClass = computed(() => {
  if (props.variant === 'segmented') {
    return 'relative inline-flex w-fit gap-0.5 rounded-sm bg-[color-mix(in_srgb,var(--app-muted)_8%,transparent)] p-0.5'
  }
  return 'relative flex gap-4 border-b border-[var(--app-border)]'
})

const indicatorClass = computed(() => {
  if (props.variant === 'segmented') {
    return 'absolute top-0.5 bottom-0.5 rounded-sm bg-[var(--app-accent)] pointer-events-none transition-[transform,width] duration-200 ease-out'
  }
  return 'absolute bottom-0 h-px bg-[var(--app-accent)] pointer-events-none transition-[transform,width] duration-200 ease-out'
})

function triggerClasses(item: ResolvedTab) {
  const isActive = props.modelValue === item.value
  const base = 'relative z-10 inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase font-medium transition-colors cursor-pointer'
  const disabledCls = item.disabled ? 'pointer-events-none opacity-50' : ''

  if (props.variant === 'segmented') {
    const activeCls = isActive ? 'text-[var(--app-accent-foreground)]' : 'text-[var(--app-muted)] hover:text-[var(--app-foreground)]'
    return [base, 'rounded-sm px-3.5 py-1.5', activeCls, disabledCls]
  }

  const activeCls = isActive
    ? 'text-[var(--app-accent)]'
    : 'text-[var(--app-muted)] hover:text-[var(--app-foreground)]'
  return [base, 'px-0 py-3', activeCls, disabledCls]
}

const contentClass = computed(() => props.variant === 'segmented'
  ? 'mt-4 focus-visible:outline-none'
  : 'mt-3 focus-visible:outline-none'
)

function selectTab(item: ResolvedTab) {
  if (item.disabled) return
  emit('update:modelValue', item.value)
}
</script>

<template>
  <div>
    <div ref="listEl" :class="listClass" role="tablist">
      <!-- Sliding indicator -->
      <div
        v-show="indicator.visible"
        :class="indicatorClass"
        :style="{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }"
      />

      <!-- Triggers. Reset refs array each render pass -->
      <template v-for="(item, i) in resolvedTabs" :key="item.value">
        <template v-if="i === 0">{{ (resetRefs(), '') }}</template>
        <button
          :ref="setTriggerRef"
          role="tab"
          :aria-selected="modelValue === item.value"
          :disabled="item.disabled"
          :class="triggerClasses(item)"
          @click="selectTab(item)"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            class="h-4 w-4"
          />
          {{ item.label }}
        </button>
      </template>
    </div>

    <template v-for="item in resolvedTabs" :key="item.value">
      <div
        v-if="modelValue === item.value"
        role="tabpanel"
        :class="contentClass"
      >
        <SlotContent v-if="item.content" :render="item.content" />
        <slot v-else :name="item.value" />
      </div>
    </template>
  </div>
</template>
