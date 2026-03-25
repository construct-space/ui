# @construct-space/ui

Vue 3 component library for Construct services. 43 production components, shared layouts, composables, and design tokens.

## Install

```bash
npm install @construct-space/ui
# or
bun add @construct-space/ui
```

### Peer Dependencies

```bash
npm install vue reka-ui @iconify/vue
```

## Usage

```ts
// Import components individually
import { CButton, CInput, CModal, CToast } from '@construct-space/ui'

// Import shared styles (tokens + utility classes)
import '@construct-space/ui/style.css'

// Or register all components globally
import { createApp } from 'vue'
import ConstructUI from '@construct-space/ui'

const app = createApp(App)
app.use(ConstructUI)
```

## Components

| Category | Components |
|----------|-----------|
| **Form** | `CButton`, `CInput`, `CTextarea`, `CSelect`, `CSelectMenu`, `CCheckbox`, `CRadioGroup`, `CSwitch`, `CSlider`, `CColorPicker`, `CFormField` |
| **Layout** | `CCard`, `CModal`, `CDrawer`, `CSlideover`, `CPopover`, `CDashboardPanel`, `CPanelSection`, `CPropRow`, `CSeparator`, `CScrollArea` |
| **Data** | `CTable`, `CCalendar`, `CTree`, `CTimeline`, `CPagination` |
| **Feedback** | `CAlert`, `CBadge`, `CChip`, `CProgress`, `CSkeleton`, `CEmpty`, `CToast` |
| **Menu** | `CDropdown`, `CDropdownMenu`, `CDropdownMenuItem`, `CContextMenu` |
| **Display** | `CIcon`, `CAvatar`, `CAccordion`, `CTabs`, `CTooltip`, `CKbd` |

## Layouts

```vue
<!-- 60px icon sidebar (billing, delivery pattern) -->
<SidebarLayout
  :nav-items="[{ icon: 'home', label: 'Dashboard', to: '/', active: true }]"
  user-name="John"
  @navigate="router.push($event)"
  @logout="auth.logout()"
>
  <router-view />
</SidebarLayout>

<!-- Top header bar -->
<HeaderLayout
  service-name="domains"
  :nav-items="[{ label: 'Dashboard', to: '/' }]"
>
  <router-view />
</HeaderLayout>
```

## Composables

```ts
import { useToast, useAuth } from '@construct-space/ui'

// Toast notifications
const { add, remove, clear } = useToast()
add({ title: 'Saved', color: 'success' })

// Auth session management
const { user, login, logout, checkSession } = useAuth({
  mePath: '/api/auth/me',
  loginPath: '/api/auth/login',
})
```

## Theming

Override CSS variables to customize colors per service:

```css
:root {
  --app-accent: #d4a843;      /* billing: gold */
  --app-accent: #ec4899;      /* domains: pink */
  --app-accent: #FF2D55;      /* delivery: red */
  --app-background: #18181b;
  --app-foreground: #fafafa;
  --app-border: #27272a;
}
```

## License

MIT
