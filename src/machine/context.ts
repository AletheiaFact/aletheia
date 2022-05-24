export type reviewTaskMachineContext = {
    userId: string;
    sentence_hash: string;
    summary: string;
    questions: string[];
    report: string;
    verification: string;
    source: string[];
    classification: string;
  }


export const initialContext: reviewTaskMachineContext = {
    userId: '',
    sentence_hash: '',
    summary: '',
    questions: [],
    report: '',
    verification: '',
    source: [],
    classification: '',
}
