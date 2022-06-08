import { RegisterOptions } from "react-hook-form";

export type FormField = {
    fieldName: string;
    label: string;
    placeholder: string;
    rules?: RegisterOptions;
    type: string;
    inputType?: string;
};
