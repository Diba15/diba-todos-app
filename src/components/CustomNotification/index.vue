<script setup>

defineOptions({
  name: 'CustomNotification'
})

const emit = defineEmits(['cancel', 'confirm'])

const props = defineProps({
  item: Object
})

fn

function cancel() {
  emit('cancel')
}
</script>

<template>
  <div class="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
    <div class="flex items-center">
      <p class="mr-4">{{ item.message }}</p>
      <button @click="handleConfirm" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Confirm</button>
      <button @click="handleCancel" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2">Cancel</button>
    </div>
  </div>
</template>

<style scoped>

</style>