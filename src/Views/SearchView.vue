<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { Gitmoji, gitmojis } from '../assets/gitmojis.schema'
import { useRouter } from 'vue-router'
import { usePreferences } from '../store/preferences'
import { CompleteType } from '../store/types'

const inputValue = ref<string>('')
const searchInput = ref<HTMLInputElement | null>()
const router = useRouter()
const preferencesStore = usePreferences()

const filteredGitmojis = computed(() => {
  return gitmojis.filter((gitmoji) => {
    return gitmoji.code.includes(inputValue.value) || gitmoji.description.includes(inputValue.value)
  })
})

onMounted(() => {
  searchInput.value?.focus()
  window.resizeTo(800, 64)
  if (!window.localStorage.getItem('openShortcut')) {
    window.localStorage.setItem('openShortcut', 'Alt+G')
  }
  if (!window.localStorage.getItem('completeType')) {
    window.localStorage.setItem('completeType', CompleteType.CODE)
  }
  preferencesStore.getOpenShortCut()
  preferencesStore.getCompleteType()
  //@ts-ignore
  window.electronAPI.setShortcut(preferencesStore.openShortCut)
})

const copyToClipboard = async (gitmoji: Gitmoji) => {
  if (preferencesStore.completeType === CompleteType.CODE) {
    await navigator.clipboard.writeText(gitmoji.code)
  } else {
    await navigator.clipboard.writeText(gitmoji.emoji)
  }
  //@ts-ignore
  window.electronAPI.selectGitmoji()
  inputValue.value = ''
  searchInput.value?.focus()
}

const handlePreferences = () => {
  //@ts-ignore
  router.push('/preferences')
}

watch(
  () => inputValue.value,
  () => {
    setTimeout(() => {
      window.resizeTo(800, document.querySelector('#container')?.clientHeight)
    }, 0)
  }
)
</script>

<template>
  <div id="container">
    <div class="flex items-center">
      <input
        ref="searchInput"
        v-model="inputValue"
        autofocus
        type="text"
        placeholder="Search for a gitmoji..."
        class="h-16 w-full rounded-tl-2xl border-l-2 border-r-2 border-t-2 border-solid border-l-neutral-500 border-r-neutral-500 border-t-neutral-500 bg-neutral-600 px-2 text-3xl text-neutral-400 focus:outline-none"
        :class="{
          'rounded-bl-2xl border-b-2 border-b-neutral-500': !inputValue,
          'border-b-2 border-b-neutral-500': inputValue
        }"
      />
      <div
        class="flex h-16 cursor-pointer items-center justify-center rounded-tr-2xl border-r-2 border-t-2 border-solid border-r-neutral-500 border-t-neutral-500 bg-neutral-600 px-2 text-neutral-400"
        :class="{
          'rounded-br-2xl border-b-2 border-b-neutral-500': !inputValue,
          'border-b-2 border-b-neutral-500': inputValue
        }"
        @click="handlePreferences"
      >
        Preferences
      </div>
    </div>
    <div
      v-if="inputValue"
      class="max-h-96 divide-y-2 divide-neutral-500 overflow-y-auto border-b-2 border-l-2 border-r-2 border-solid border-neutral-500"
    >
      <button
        v-for="gitmoji in filteredGitmojis"
        :key="gitmoji.name"
        class="w-full bg-neutral-600 px-2 py-4 text-xl text-neutral-400 hover:bg-neutral-700 focus:border-neutral-500 focus:bg-neutral-700 focus:outline-none"
        @click="copyToClipboard(gitmoji)"
        @keydown.enter.prevent="copyToClipboard(gitmoji)"
      >
        <span class="line-clamp-1 flex items-center justify-start gap-3">
          <span>{{ gitmoji.emoji }}</span>
          <span>{{ gitmoji.code }}</span>
          <span>{{ gitmoji.description }}</span>
        </span>
      </button>
      <div v-if="!filteredGitmojis.length" class="w-full bg-neutral-600">
        <div class="px-2 py-4 text-xl text-neutral-400">No gitmoji found</div>
      </div>
    </div>
  </div>
</template>
