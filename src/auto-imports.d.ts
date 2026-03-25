/**
 * Auto-import declarations for Vue Composition API
 * These are auto-imported in Nuxt but need declarations for standalone builds.
 */
import type {
  Ref,
  ComputedRef,
  WritableComputedRef,
  UnwrapRef,
  ShallowRef,
  WatchOptions,
  WatchStopHandle,
  WatchEffect,
  WatchSource,
} from 'vue'

declare global {
  const computed: typeof import('vue')['computed']
  const ref: typeof import('vue')['ref']
  const reactive: typeof import('vue')['reactive']
  const readonly: typeof import('vue')['readonly']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
  const onMounted: typeof import('vue')['onMounted']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onUpdated: typeof import('vue')['onUpdated']
  const onActivated: typeof import('vue')['onActivated']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const provide: typeof import('vue')['provide']
  const inject: typeof import('vue')['inject']
  const nextTick: typeof import('vue')['nextTick']
  const defineProps: typeof import('vue')['defineProps']
  const defineEmits: typeof import('vue')['defineEmits']
  const defineExpose: typeof import('vue')['defineExpose']
  const withDefaults: typeof import('vue')['withDefaults']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const unref: typeof import('vue')['unref']
  const isRef: typeof import('vue')['isRef']
  const shallowRef: typeof import('vue')['shallowRef']
  const triggerRef: typeof import('vue')['triggerRef']
  const customRef: typeof import('vue')['customRef']
  const toRaw: typeof import('vue')['toRaw']
  const markRaw: typeof import('vue')['markRaw']
  const effectScope: typeof import('vue')['effectScope']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const defineComponent: typeof import('vue')['defineComponent']
  const h: typeof import('vue')['h']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const Transition: typeof import('vue')['Transition']
  const TransitionGroup: typeof import('vue')['TransitionGroup']
  const Teleport: typeof import('vue')['Teleport']
}

export {}
