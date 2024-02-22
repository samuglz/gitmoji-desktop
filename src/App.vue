<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { gitmojis } from './assets/gitmojis.schema'

const inputValue = ref<string>('')

const filteredGitmojis = computed(() => {
  return gitmojis.filter((gitmoji) => {
    return gitmoji.code.includes(inputValue.value) || gitmoji.description.includes(inputValue.value)
  })
})

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
    <input
      v-model="inputValue"
      autofocus
      type="text"
      placeholder="Search for a gitmoji..."
      class="h-16 w-full rounded-tl-2xl rounded-tr-2xl border-l-2 border-r-2 border-t-2 border-solid border-l-neutral-500 border-r-neutral-500 border-t-neutral-500 bg-neutral-600 px-2 text-3xl text-neutral-400 focus:outline-none"
      :class="{
        'rounded-bl-2xl rounded-br-2xl border-b-2': !inputValue,
        'border-b-2 border-b-neutral-500': inputValue
      }"
    />
    <div
      v-if="inputValue"
      class="max-h-96 divide-y-2 divide-neutral-500 overflow-y-auto border-b-2 border-l-2 border-r-2 border-solid border-neutral-500"
    >
      <button
        v-for="gitmoji in filteredGitmojis"
        :key="gitmoji.name"
        class="w-full bg-neutral-600 px-2 py-4 text-xl text-neutral-400 hover:bg-neutral-700 focus:border-neutral-500 focus:bg-neutral-700 focus:outline-none"
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

<style scoped></style>
