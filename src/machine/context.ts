export type reviewTaskMachineContext = {
    userId: string;
    sentence_hash: string;
  }


export const initialContext: reviewTaskMachineContext = {
    userId: '',
    sentence_hash: ''
}
