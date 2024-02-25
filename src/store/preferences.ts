import { defineStore } from 'pinia'
import { CompleteType, State } from './types'

export const usePreferences = defineStore({
  id: 'preferences',
  state: (): State => ({
    openShortCut: '',
    completeType: CompleteType.CODE
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
    },
    getCompleteType() {
      this.completeType = window.localStorage.getItem('completeType') as CompleteType
    },
    setCompleteType(completeType: CompleteType) {
      this.completeType = completeType
      window.localStorage.setItem('completeType', completeType)
    }
  }
})
