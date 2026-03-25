// Components
export { default as Accordion } from './components/Accordion.vue'
export { default as Alert } from './components/Alert.vue'
export { default as Avatar } from './components/Avatar.vue'
export { default as Badge } from './components/Badge.vue'
export { default as Button } from './components/Button.vue'
export { default as Calendar } from './components/Calendar.vue'
export { default as Card } from './components/Card.vue'
export { default as Checkbox } from './components/Checkbox.vue'
export { default as Chip } from './components/Chip.vue'
export { default as ColorPicker } from './components/ColorPicker.vue'
export { default as ContextMenu } from './components/ContextMenu.vue'
export { default as DashboardPanel } from './components/DashboardPanel.vue'
export { default as Drawer } from './components/Drawer.vue'
export { default as Dropdown } from './components/Dropdown.vue'
export { default as DropdownMenu } from './components/DropdownMenu.vue'
export { default as DropdownMenuItem } from './components/DropdownMenuItem.vue'
export { default as Empty } from './components/Empty.vue'
export { default as FormField } from './components/FormField.vue'
export { default as Icon } from './components/Icon.vue'
export { default as Input } from './components/Input.vue'
export { default as Kbd } from './components/Kbd.vue'
export { default as Modal } from './components/Modal.vue'
export { default as Pagination } from './components/Pagination.vue'
export { default as PanelSection } from './components/PanelSection.vue'
export { default as Popover } from './components/Popover.vue'
export { default as Progress } from './components/Progress.vue'
export { default as PropRow } from './components/PropRow.vue'
export { default as RadioGroup } from './components/RadioGroup.vue'
export { default as ScrollArea } from './components/ScrollArea.vue'
export { default as Select } from './components/Select.vue'
export { default as SelectMenu } from './components/SelectMenu.vue'
export { default as Separator } from './components/Separator.vue'
export { default as Skeleton } from './components/Skeleton.vue'
export { default as Slideover } from './components/Slideover.vue'
export { default as Slider } from './components/Slider.vue'
export { default as Switch } from './components/Switch.vue'
export { default as Table } from './components/Table.vue'
export { default as Tabs } from './components/Tabs.vue'
export { default as Textarea } from './components/Textarea.vue'
export { default as Timeline } from './components/Timeline.vue'
export { default as Notification } from './components/Notification.vue'
export { default as Tooltip } from './components/Tooltip.vue'
export { default as Tree } from './components/Tree.vue'

// New components
export { default as Autocomplete } from './components/Autocomplete.vue'
export { default as Breadcrumbs } from './components/Breadcrumbs.vue'
export { default as DatePicker } from './components/DatePicker.vue'
export { default as FileInput } from './components/FileInput.vue'
export { default as MultiSelect } from './components/MultiSelect.vue'
export { default as Sidebar3D } from './components/Sidebar3D.vue'
export { default as ToggleGroup } from './components/ToggleGroup.vue'
export { default as Toolbar3D } from './components/Toolbar3D.vue'

// Layouts
export { default as SidebarLayout } from './layouts/SidebarLayout.vue'
export { default as HeaderLayout } from './layouts/HeaderLayout.vue'

// Composables
export { useNotification, notify } from './composables/useNotification'
export type { Notification as NotificationItem } from './composables/useNotification'
export { useAuth } from './composables/useAuth'
export type { AuthUser, UseAuthOptions } from './composables/useAuth'
export { useTheme } from './composables/useTheme'
export type { Theme } from './composables/useTheme'
export { useClipboard } from './composables/useClipboard'
export { useMediaQuery, useBreakpoints } from './composables/useMediaQuery'
export { useFormValidation, required, minLength, maxLength, email, pattern } from './composables/useFormValidation'
export { useKeyboard, useHotkey } from './composables/useKeyboard'
export type { KeyBinding } from './composables/useKeyboard'
export { useClickOutside } from './composables/useClickOutside'
export { useLocalStorage } from './composables/useLocalStorage'
export { useAsync } from './composables/useAsync'
export type { AsyncState } from './composables/useAsync'
export { useDebounce, useThrottle, debounce } from './composables/useDebounce'
export { useToggle, useCounter } from './composables/useToggle'
export { useSearch } from './composables/useSearch'
export { useIntersectionObserver } from './composables/useIntersectionObserver'

// Tokens CSS (importable as side-effect)
import './tokens/tokens.css'

// Vue plugin for global registration
import type { App } from 'vue'

export const ConstructUI = {
  install(app: App) {
    // Auto-register all components with C prefix
    const components = import.meta.glob('./components/*.vue', { eager: true }) as Record<string, { default: any }>
    for (const [path, module] of Object.entries(components)) {
      const name = 'C' + path.match(/\/(\w+)\.vue$/)?.[1]
      if (name && module.default) {
        app.component(name, module.default)
      }
    }
  },
}

export default ConstructUI
