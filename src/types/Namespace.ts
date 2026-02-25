import { TFunction } from "next-i18next";
import { User } from "./User";

export type NameSpace = {
    name: string;
    users: User[];
    slug: string;
    _id: string;
};

export enum NameSpaceEnum {
    Main = "main",
}

export interface IDynamicNameSpaceForm {
    nameSpace: NameSpace;
    onSubmit: (value: NameSpace) => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isDrawerOpen: boolean;
    onClose: () => void;
    t: TFunction;
}
