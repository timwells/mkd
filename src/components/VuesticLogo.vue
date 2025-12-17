<template>
  <svg height="57" alt="MXD" fill="none" viewBox="0 0 200 57" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="paint0_linear" gradientUnits="userSpaceOnUse" x1="0" x2="200" y1="28.5" y2="28.5">
        <stop stop-color="#154EC1" />
        <stop stop-color="#2AB8F5" offset="1" />
      </linearGradient>
    </defs>

    <text x="10" y="40" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="url(#paint0_linear)">
      MXD
    </text>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useColors } from 'vuestic-ui'

const { getColor } = useColors()

const props = withDefaults(
  defineProps<{
    height?: number
    start?: string
    end?: string
  }>(),
  {
    height: 18,
    start: 'primary',
    end: undefined,
  },
)

const colorsComputed = computed(() => {
  return {
    start: getColor(props.start),
    end: getColor(props.end || props.start),
  }
})
</script>
