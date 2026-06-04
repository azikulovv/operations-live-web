<script setup lang="ts">
export type UiTabItem<T extends string = string> = {
  label: string
  value: T
}

type Props<T extends string = string> = {
  modelValue: T
  items: UiTabItem<T>[]
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="inline-flex w-fit rounded-xl border border-slate-200 bg-slate-50 p-1">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="h-8 rounded-lg px-3 text-xs font-medium transition"
      :class="
        modelValue === item.value
          ? 'bg-white text-slate-950 shadow-sm'
          : 'text-slate-500 hover:text-slate-950'
      "
      @click="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
