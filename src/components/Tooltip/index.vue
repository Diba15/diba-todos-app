<script setup>
import { ref } from 'vue';

const props = defineProps({
  text: String
});

const visible = ref(false);

const showTooltip = () => {
  visible.value = true;
};

const hideTooltip = () => {
  visible.value = false;
};
</script>

<template>
  <div class="relative" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    <div v-if="visible" class="absolute left-full ml-2 p-2 bg-blue-600 text-white text-sm rounded shadow-lg">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
</style>