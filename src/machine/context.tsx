export type reviewTaskMachineContext = {
  id: string;
  sentenceHash: string;
}

export const initialContext: reviewTaskMachineContext = {
  id: '',
  sentenceHash: ''
}
