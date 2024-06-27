import verificationRequestApi from "../../../../api/verificationRequestApi";
import { createFormField, FormField } from "../../../Form/FormField";

export const fetchVerificationRequestList = async (content) => {
    const verificationRequestSearchResults =
        await verificationRequestApi.getVerificationRequests({
            searchContent: content,
        });
    return verificationRequestSearchResults.map((verificationRequest) => ({
        label: verificationRequest.content,
        value: verificationRequest._id,
    }));
};

const verificationRequestForm: FormField[] = [
    createFormField({
        fieldName: "group",
        type: "inputSearch",
        i18nKey: "group",
        required: false,
        extraProps: { dataLoader: fetchVerificationRequestList },
    }),

    createFormField({
        fieldName: "isSensitive",
        type: "textbox",
        required: false,
    }),
];

export default verificationRequestForm;
