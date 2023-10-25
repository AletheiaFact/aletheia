import { atom } from "jotai";
import { NameSpace, NameSpaceEnum } from "../types/namespace";
import { indexOfItemBeingEdited } from "./editDrawer";

const currentNameSpace = atom<NameSpaceEnum>(NameSpaceEnum.Main);
const atomNameSpacesList = atom<NameSpace[]>([]);

const nameSpaceBeeingEdited = atom(
    (get) => get(atomNameSpacesList)[get(indexOfItemBeingEdited)]
);

const addNameSpaceToList = atom(null, (_get, set, NameSpace: NameSpace) => {
    const newNameSpaces = [..._get(atomNameSpacesList), NameSpace];
    set(atomNameSpacesList, newNameSpaces);
});

export {
    atomNameSpacesList,
    addNameSpaceToList,
    nameSpaceBeeingEdited,
    currentNameSpace,
};
