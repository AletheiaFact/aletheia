import { TFunction } from "i18next";
import ImageApi from "../../../api/image";
import OrganizationApi from "../../../api/organizationApi";
import type { ParticipantsPersistenceApi } from "./persistParticipants";

export const createParticipantsApi = (
    t: TFunction
): ParticipantsPersistenceApi => ({
    uploadLogos: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return ImageApi.uploadImage(formData, t);
    },
    createOrganization: (input) => OrganizationApi.create(input, t),
    updateOrganization: (id, input) => OrganizationApi.update(id, input, t),
});
