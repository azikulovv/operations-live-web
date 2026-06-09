<script setup lang="ts">
type InputType = 'text' | 'number'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    type?: InputType
    inputmode?: 'text' | 'numeric' | 'decimal'
    class?: string
  }>(),
  {
    type: 'text',
    inputmode: 'text',
    class: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement

  emit('update:modelValue', props.type === 'number' ? Number(input.value) : input.value)
}
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :inputmode="inputmode"
    :class="[
      'h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100',
      props.class,
    ]"
    @input="handleInput"
  />
</template>
