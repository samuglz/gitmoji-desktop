import { defineStore } from 'pinia'
import { State } from './types'

export const usePreferences = defineStore({
  id: 'preferences',
  state: (): State => ({
    openShortCut: ''
  }),
  actions: {
    getOpenShortCut() {
      this.openShortCut = window.localStorage.getItem('openShortcut')
    },
    setShortCut(shortCut: string) {
      this.openShortCut = shortCut
      window.localStorage.setItem('openShortcut', shortCut)
      //@ts-ignore
      window.electronAPI.setShortcut(shortCut)
    }
  }
})
