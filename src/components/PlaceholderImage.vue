<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100%" height="100%" fill="#e0e0e0" />
    <text
      x="50%"
      y="50%"
      fill="#666"
      font-family="Arial, sans-serif"
      font-size="14"
      text-anchor="middle"
      dy=".3em"
    >
      {{ width }}x{{ height }}
    </text>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: 100,
    },
    height: {
      type: [Number, String],
      default: 100,
    },
  },
}
</script>
