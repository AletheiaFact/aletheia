import { atom } from "jotai";

const interviewAtom = atom({
    sources: [""],
    title: "",
    date: new Date(),
    interviewId: "",
    isLive: true,
});

export { interviewAtom };
