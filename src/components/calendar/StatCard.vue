<template>
  <div :class="cardClasses">
    <div :class="valueClasses">{{ value }}</div>
    <div class="text-xs sm:text-sm text-gray-600">{{ title }}</div>
    <div class="text-xs text-gray-500 mt-1">{{ subtitle }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  value: string | number;
  title: string;
  subtitle: string;
  color?: "blue" | "green" | "purple" | "red";
}

const props = withDefaults(defineProps<Props>(), {
  color: "blue",
});

const cardClasses = computed(() => {
  const colorMap = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    red: "bg-red-50",
  };
  return `text-center p-3 sm:p-4 rounded-lg ${colorMap[props.color]}`;
});

const valueClasses = computed(() => {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    red: "text-red-600",
  };
  return `text-xl sm:text-2xl font-bold ${colorMap[props.color]}`;
});
</script>
