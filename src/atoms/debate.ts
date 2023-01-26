import { atom } from "jotai";

const debateAtom = atom({
    sources: [""],
    title: "",
    date: new Date(),
    debateId: "",
});

export { debateAtom };
