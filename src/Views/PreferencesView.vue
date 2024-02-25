<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePreferences } from '../store/preferences'
import { useRouter } from 'vue-router'
import { CompleteType } from '../store/types'

const shortcutInput = ref('')
const shortcut = ref<HTMLInputElement | null>()
const lastKey = ref('')
const ForbidenKeys = ['Alt', 'Control', 'Shift', 'Meta', 'Tab', ' ', 'Backspace', 'Enter']
const preferencesStore = usePreferences()
const currentShortcut = ref<string[]>(['Alt'])
const router = useRouter()
const completeType = ref<CompleteType>(preferencesStore.completeType)

onMounted(() => {
  window.resizeTo(800, 400)
  currentShortcut.value = preferencesStore.openShortCut.split('+')
  const noSpecialKeys = currentShortcut.value.filter(
    (key) => !['Alt', 'Ctrl', 'Shift'].includes(key)
  )
  shortcutInput.value = noSpecialKeys[noSpecialKeys.length - 1]
  lastKey.value = noSpecialKeys[noSpecialKeys.length - 1]
})

const handleInput = (e: KeyboardEvent) => {
  if (!ForbidenKeys.includes(e.key)) {
    e.preventDefault()
    shortcutInput.value = e.key.toUpperCase()
    currentShortcut.value = currentShortcut.value.filter((key) => key !== lastKey.value)
    currentShortcut.value.push(e.key.toUpperCase())
    lastKey.value = e.key.toUpperCase()
    shortcut.value?.blur()
  }
}

const handleBlur = () => {
  shortcutInput.value = lastKey.value
}

const handleSave = () => {
  preferencesStore.setShortCut(currentShortcut.value.join('+'))
  preferencesStore.setCompleteType(completeType.value)
  router.push('/')
}

const handleCancel = () => {
  router.push('/')
}
</script>

<template>
  <div class="h-dvh rounded bg-neutral-600 p-2 text-white">
    <h1 class="text-3xl">User preferences</h1>
    <div class="mt-2">
      <div>Open shortcut:</div>
      <div class="flex items-center gap-2">
        <label class="flex items-center gap-2">
          <input v-model="currentShortcut" type="checkbox" value="Ctrl" />
          <span>Ctrl</span>
        </label>
        <span>+</span>
        <label class="flex items-center gap-2">
          <input v-model="currentShortcut" type="checkbox" value="Alt" />
          <span>Alt</span>
        </label>
        <span>+</span>
        <label class="flex items-center gap-2">
          <input v-model="currentShortcut" type="checkbox" value="Shift" />
          <span>Shift</span>
        </label>
        <span>+</span>
        <input
          ref="shortcut"
          v-model="shortcutInput"
          type="text"
          class="w-20 px-1 text-black focus:outline-none"
          @keydown="handleInput"
          @blur="handleBlur"
        />
      </div>
    </div>
    <div class="mt-4">
      <span>Complete gitmoji as: </span>
      <select v-model="completeType" class="w-40 px-1 text-black focus:outline-none">
        <option
          :selected="preferencesStore.completeType === CompleteType.CODE"
          :value="CompleteType.CODE"
        >
          Code (:Sparkles:)
        </option>
        <option
          :selected="preferencesStore.completeType === CompleteType.UNICODE"
          :value="CompleteType.UNICODE"
        >
          Unicode (✨)
        </option>
      </select>
    </div>
    <div class="absolute bottom-0 left-0 flex w-full items-center justify-end gap-4 p-4">
      <button @click="handleSave">Save</button>
      <button @click="handleCancel">Cancel</button>
    </div>
  </div>
</template>
