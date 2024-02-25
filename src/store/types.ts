export type State = {
  openShortCut: string
  completeType: CompleteType
}

export enum CompleteType {
  CODE = 'Code',
  UNICODE = 'Unicode'
}
