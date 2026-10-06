import { Injectable } from "@nestjs/common";
import type { IVerificationRequestService } from "../../interfaces/verification-request.service.interface";
import { NotImplementedError } from "../../database/errors";

const notPorted = (method: string) => () => {
    throw new NotImplementedError("postgres", method);
};

@Injectable()
export class PostgresVerificationRequestService
    implements IVerificationRequestService
{
    listAll = notPorted("listAll");
    findAll = notPorted("findAll");
    findBySourceUrl = notPorted("findBySourceUrl");
    getById = notPorted("getById");
    getByIdWithPopulatedFields = notPorted("getByIdWithPopulatedFields");
    create = notPorted("create");
    createAiTask = notPorted("createAiTask");
    updateFieldByAiTask = notPorted("updateFieldByAiTask");
    revalidateAndRunMissingStates = notPorted("revalidateAndRunMissingStates");
    triggerStateMachineForMissingState = notPorted(
        "triggerStateMachineForMissingState"
    );
    findByDataHash = notPorted("findByDataHash");
    findRemovedIds = notPorted("findRemovedIds");
    removeVerificationRequestFromGroup = notPorted(
        "removeVerificationRequestFromGroup"
    );
    update = notPorted("update");
    count = notPorted("count");
    createEmbedContent = notPorted("createEmbedContent");
    findSimilarRequests = notPorted("findSimilarRequests");
    updateVerificationRequestWithTopics = notPorted(
        "updateVerificationRequestWithTopics"
    );
    checkAndRetryStaleAiTasks = notPorted("checkAndRetryStaleAiTasks");
    manualOverrideField = notPorted("manualOverrideField");
    cascadeUpdateDataHash = notPorted("cascadeUpdateDataHash");
}
