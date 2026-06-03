<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string
    label?: string
    modelValue: string
    type?: string
    placeholder?: string
    autocomplete?: string
    error?: string
  }>(),
  {
    id: '',
    label: '',
    type: 'text',
    placeholder: '',
    autocomplete: '',
    error: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="mb-2 block text-sm font-medium text-slate-700">
      {{ label }}
    </label>

    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      class="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-50': error }"
      @input="handleInput"
    />

    <UiFieldError :message="error" />
  </div>
</template>
