<!-- Toast.vue -->
<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'rounded-lg shadow-lg px-4 py-3 flex items-center gap-2 min-w-[300px] max-w-md',
        toast.type === 'success' ? 'bg-emerald-500 text-white' : '',
        toast.type === 'error' ? 'bg-red-500 text-white' : '',
        toast.type === 'info' ? 'bg-blue-500 text-white' : '',
        toast.type === 'warning' ? 'bg-amber-500 text-white' : '',
      ]"
    >
      <Icon
        :name="getIcon(toast.type)"
        class="w-5 h-5 flex-shrink-0"
      />
      <span class="text-sm">{{ toast.message }}</span>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts } = useToast()

function getIcon(type: string) {
  switch (type) {
    case 'success':
      return 'heroicons:check-circle'
    case 'error':
      return 'heroicons:x-circle'
    case 'info':
      return 'heroicons:information-circle'
    case 'warning':
      return 'heroicons:exclamation-triangle'
    default:
      return 'heroicons:information-circle'
  }
}
</script>
