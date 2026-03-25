<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  defineComponent,
  type Component,
  type PropType,
  type Slot,
  type VNode,
  useSlots,
} from 'vue'
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'reka-ui'
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

const listClass = computed(() => {
  if (props.variant === 'segmented') {
    return 'inline-flex w-fit gap-1 rounded-lg bg-[color-mix(in_srgb,var(--app-muted)_8%,transparent)] p-1'
  }
  return 'flex gap-1 border-b border-[var(--app-border)]'
})

const triggerClass = computed(() => {
  if (props.variant === 'segmented') {
    return 'inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-[var(--app-muted)] transition-colors cursor-pointer hover:text-[var(--app-foreground)] data-[state=active]:bg-app-accent data-[state=active]:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
  }
  return 'inline-flex items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-[var(--app-muted)] transition-colors cursor-pointer hover:text-[var(--app-foreground)] -mb-px data-[state=active]:text-[var(--app-accent)] data-[state=active]:border-[var(--app-accent)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
})

const contentClass = computed(() => props.variant === 'segmented'
  ? 'mt-4 focus-visible:outline-none'
  : 'mt-3 focus-visible:outline-none'
)
</script>

<template>
  <TabsRoot
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event as string)"
  >
    <TabsList :class="listClass">
      <TabsTrigger
        v-for="item in resolvedTabs"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled"
        :class="triggerClass"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          class="h-4 w-4"
        />
        {{ item.label }}
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="item in resolvedTabs"
      :key="item.value"
      :value="item.value"
      :class="contentClass"
    >
      <SlotContent v-if="item.content" :render="item.content" />
      <slot v-else :name="item.value" />
    </TabsContent>
  </TabsRoot>
</template>
