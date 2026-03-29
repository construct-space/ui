<script setup lang="ts">
/**
 * Tooltip - Nuxt UI v3 compatible tooltip
 */
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from 'reka-ui'

withDefaults(defineProps<{
  text?: string
  content?: { side?: 'top' | 'bottom' | 'left' | 'right'; align?: 'start' | 'center' | 'end'; sideOffset?: number }
  popper?: { placement?: string }
}>(), {
  text: '',
})
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="content?.side || 'bottom'"
          :align="content?.align || 'center'"
          :side-offset="content?.sideOffset || 6"
          class="pointer-events-none"
        >
          <div class="rounded-lg px-3 py-2 text-xs font-medium text-white shadow-lg max-w-[250px] text-center" style="background-color: #4b4b4b">
            {{ text }}
          </div>
          <TooltipArrow style="fill: #4b4b4b" :width="10" :height="5" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
