// Components
export { default as CAccordion } from './components/Accordion.vue'
export { default as CAlert } from './components/Alert.vue'
export { default as CAvatar } from './components/Avatar.vue'
export { default as CBadge } from './components/Badge.vue'
export { default as CButton } from './components/Button.vue'
export { default as CCalendar } from './components/Calendar.vue'
export { default as CCard } from './components/Card.vue'
export { default as CCheckbox } from './components/Checkbox.vue'
export { default as CChip } from './components/Chip.vue'
export { default as CColorPicker } from './components/ColorPicker.vue'
export { default as CContextMenu } from './components/ContextMenu.vue'
export { default as CDashboardPanel } from './components/DashboardPanel.vue'
export { default as CDrawer } from './components/Drawer.vue'
export { default as CDropdown } from './components/Dropdown.vue'
export { default as CDropdownMenu } from './components/DropdownMenu.vue'
export { default as CDropdownMenuItem } from './components/DropdownMenuItem.vue'
export { default as CEmpty } from './components/Empty.vue'
export { default as CFormField } from './components/FormField.vue'
export { default as CIcon } from './components/Icon.vue'
export { default as CInput } from './components/Input.vue'
export { default as CKbd } from './components/Kbd.vue'
export { default as CModal } from './components/Modal.vue'
export { default as CPagination } from './components/Pagination.vue'
export { default as CPanelSection } from './components/PanelSection.vue'
export { default as CPopover } from './components/Popover.vue'
export { default as CProgress } from './components/Progress.vue'
export { default as CPropRow } from './components/PropRow.vue'
export { default as CRadioGroup } from './components/RadioGroup.vue'
export { default as CScrollArea } from './components/ScrollArea.vue'
export { default as CSelect } from './components/Select.vue'
export { default as CSelectMenu } from './components/SelectMenu.vue'
export { default as CSeparator } from './components/Separator.vue'
export { default as CSkeleton } from './components/Skeleton.vue'
export { default as CSlideover } from './components/Slideover.vue'
export { default as CSlider } from './components/Slider.vue'
export { default as CSwitch } from './components/Switch.vue'
export { default as CTable } from './components/Table.vue'
export { default as CTabs } from './components/Tabs.vue'
export { default as CTextarea } from './components/Textarea.vue'
export { default as CTimeline } from './components/Timeline.vue'
export { default as CToast } from './components/Toast.vue'
export { default as CTooltip } from './components/Tooltip.vue'
export { default as CTree } from './components/Tree.vue'

// Layouts
export { default as SidebarLayout } from './layouts/SidebarLayout.vue'
export { default as HeaderLayout } from './layouts/HeaderLayout.vue'

// Composables
export { useToast } from './composables/useToast'
export type { Toast } from './composables/useToast'
export { useAuth } from './composables/useAuth'
export type { AuthUser, UseAuthOptions } from './composables/useAuth'

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
