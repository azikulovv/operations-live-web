<script setup lang="ts">
type InputType = 'text' | 'number'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    type?: InputType
    inputmode?: 'text' | 'numeric' | 'decimal'
    class?: string
    debounce?: number
  }>(),
  {
    type: 'text',
    inputmode: 'text',
    class: '',
    debounce: 500,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const draft = ref<string | number>(props.modelValue)
const isFocused = ref(false)
let lastEmittedValue: string | number = props.modelValue
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (value) => {
    if (!isFocused.value) {
      draft.value = value
      lastEmittedValue = value
    }
  },
)

function emitDraft() {
  if (draft.value === lastEmittedValue) return

  lastEmittedValue = draft.value
  emit('update:modelValue', draft.value)
}

function scheduleCommit() {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (props.debounce <= 0) return

  debounceTimer = setTimeout(() => {
    debounceTimer = null
    emitDraft()
  }, props.debounce)
}

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement

  draft.value = props.type === 'number' ? Number(input.value) : input.value
  scheduleCommit()
}

function commit() {
  isFocused.value = false
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  emitDraft()
}

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  emitDraft()
})
</script>

<template>
  <input
    :value="draft"
    :type="type"
    :inputmode="inputmode"
    :class="[
      'h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 transition outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100',
      props.class,
    ]"
    @focus="isFocused = true"
    @input="handleInput"
    @blur="commit"
    @keydown.enter="($event.target as HTMLInputElement).blur()"
  />
</template>
