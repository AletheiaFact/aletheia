import { TFunction } from "i18next";
import { MessageManager } from "../components/Messages";
import { createApiInstance } from "./apiFactory";

const request = createApiInstance("/api/committee-interest");

export interface CommitteeInterestApplicationPayload {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    region: string;
    actingAs: string;
    institution: string;
    role: string;
    interestAreas: string;
    contributionTypes: string;
    availability: string;
    priorExperience: string;
    motivation: string;
    consentData: true;
    consentComms: true;
    recaptcha: string;
}

const submitApplication = (
    payload: CommitteeInterestApplicationPayload,
    t?: TFunction
) => {
    return request
        .post("/", payload)
        .then((response) => {
            MessageManager.showMessage(
                "success",
                t("form.submitSuccess")
            );

            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t("form.submitError")
            );
            throw err;
        });
};

const CommitteeInterestApi = {
    submitApplication,
};

export default CommitteeInterestApi;
