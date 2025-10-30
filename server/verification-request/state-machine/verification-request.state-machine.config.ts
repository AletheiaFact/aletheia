import { getOnDoneAction, getOnErrorAction } from "./base";
import { AnyEventObject, assign, InvokeConfig } from "xstate";

import { CommonStateMachineStates } from "./base";
import {
    VerificationRequestMessages,
    VerificationRequestStateMachineEvents,
    VerificationRequestStateMachineStates,
} from "../dto/types";
import {
    VerificationRequestStateMachineContext,
    VerificationRequestStateMachineService,
} from "./verification-request.state-machine.interface";
import { VerificationRequestService } from "../verification-request.service";
import { CreateAiTaskDto } from "../../ai-task/dto/create-ai-task.dto";
import {
    AiTaskType,
    CallbackRoute,
    OPENAI_EMBEDDING_MODEL,
    OPENAI_IDENTIFY_DATA,
} from "../../ai-task/constants/ai-task.constants";

const verificationRequestStateMachineSchema = {
    context: {} as VerificationRequestStateMachineContext,
    events: {} as
        | { type: VerificationRequestStateMachineEvents.CREATE }
        | { type: VerificationRequestStateMachineEvents.EMBED }
        | { type: VerificationRequestStateMachineEvents.IDENTIFY_DATA }
        | { type: VerificationRequestStateMachineEvents.DEFINE_TOPICS }
        | { type: VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA }
        | { type: VerificationRequestStateMachineEvents.DEFINE_SEVERITY },
};

const getStateInvokeSrc = (
    eventName: string,
    getVerificationRequestService: () => VerificationRequestService
): InvokeConfig<any, any>["src"] => {
    switch (eventName) {
        case VerificationRequestStateMachineEvents.CREATE:
            return async (
                context: VerificationRequestStateMachineContext,
                event,
                meta
            ) => {
                return getVerificationRequestService().create(
                    context.verificationRequest,
                    context.user
                );
            };
        case VerificationRequestStateMachineEvents.EMBED:
            return async (
                context: VerificationRequestStateMachineContext,
                event,
                meta
            ) => {
                const taskDto: CreateAiTaskDto = {
                    type: AiTaskType.TEXT_EMBEDDING,
                    content: {
                        text: context.verificationRequest.content,
                        model: OPENAI_EMBEDDING_MODEL,
                    },
                    callbackRoute: CallbackRoute.VERIFICATION_UPDATE_EMBEDDING,
                    callbackParams: {
                        targetId: context.verificationRequest.id,
                        field: "embedding",
                    },
                };
                await getVerificationRequestService().createAiTask(taskDto);
                return context.result;
            };
        case VerificationRequestStateMachineEvents.IDENTIFY_DATA:
            return async (
                context: VerificationRequestStateMachineContext,
                event,
                meta
            ) => {
                const taskDto: CreateAiTaskDto = {
                    type: AiTaskType.IDENTIFYING_DATA,
                    content: {
                        text: context.verificationRequest.content,
                        model: OPENAI_IDENTIFY_DATA,
                    },
                    callbackRoute:
                        CallbackRoute.VERIFICATION_UPDATE_IDENTIFYING_DATA,
                    callbackParams: {
                        targetId: context.verificationRequest.id,
                        field: "identifiedData",
                    },
                };
                await getVerificationRequestService().createAiTask(taskDto);
                return context.result;
            };
        case VerificationRequestStateMachineEvents.DEFINE_TOPICS:
            return async (
                context: VerificationRequestStateMachineContext,
                event,
                meta
            ) => {
                // TODO: Add more context for be used to recover the topics
                const taskDto: CreateAiTaskDto = {
                    type: AiTaskType.DEFINING_TOPICS,
                    content: {
                        text: context.verificationRequest.identifiedData,
                        model: OPENAI_IDENTIFY_DATA,
                    },
                    callbackRoute:
                        CallbackRoute.VERIFICATION_UPDATE_DEFINING_TOPICS,
                    callbackParams: {
                        targetId: context.verificationRequest.id,
                        field: "topics",
                    },
                };
                await getVerificationRequestService().createAiTask(taskDto);
                return context.result;
            };
        case VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA:
            return async (
                context: VerificationRequestStateMachineContext,
                event,
                meta
            ) => {
                // TODO: Add more context for be used to recover the impact area
                const taskDto: CreateAiTaskDto = {
                    type: AiTaskType.DEFINING_IMPACT_AREA,
                    content: {
                        text: context.verificationRequest.content,
                        model: OPENAI_IDENTIFY_DATA,
                    },
                    callbackRoute:
                        CallbackRoute.VERIFICATION_UPDATE_DEFINING_IMPACT_AREA,
                    callbackParams: {
                        targetId: context.verificationRequest.id,
                        field: "impactArea",
                    },
                };
                await getVerificationRequestService().createAiTask(taskDto);
                return context.result;
            };
        case VerificationRequestStateMachineEvents.DEFINE_SEVERITY:
            return async (
                context: VerificationRequestStateMachineContext,
                event,
                meta
            ) => {
                const impactAreaWikidataId =
                    context.verificationRequest.impactArea?.wikidataId || null;
                const topicsWikidataIds =
                    context.verificationRequest.topics
                        ?.map((t) => t.wikidataId)
                        .filter(Boolean) || [];

                // TODO: Fix personality wikidataId extraction
                // Currently identifiedData is stored as a string (just the name), not an object with wikidataId
                const personalityWikidataId = null;

                const taskDto: CreateAiTaskDto = {
                    type: AiTaskType.DEFINING_SEVERITY,
                    content: {
                        verificationId: context.verificationRequest.id,
                        impactAreaWikidataId,
                        topicsWikidataIds,
                        personalityWikidataId,
                        text: context.verificationRequest.content,
                        model: OPENAI_IDENTIFY_DATA,
                    },
                    callbackRoute:
                        CallbackRoute.VERIFICATION_UPDATE_DEFINING_SEVERITY,
                    callbackParams: {
                        targetId: context.verificationRequest.id,
                        field: "severity",
                    },
                };
                await getVerificationRequestService().createAiTask(taskDto);
                return context.result;
            };
        default:
            return async (
                context: VerificationRequestStateMachineContext,
                event,
                meta
            ) => {
                return;
            };
    }
};

type ConditionalFunc = (context: any, event: any) => boolean;

const verificationRequestCanRunStep: ConditionalFunc = (context, event) => {
    const eventName = event.type.split(".")[2];
    const hasStateExecuted =
        context.verificationRequest?.statesExecuted?.includes(eventName);
    return !hasStateExecuted;
};

const canDefineTopics: ConditionalFunc = (context, event) => {
    // Topics can only run after identifiedData is populated
    const hasIdentifiedData = context.verificationRequest?.identifiedData;
    const notAlreadyExecuted =
        !context.verificationRequest?.statesExecuted?.includes("topics");

    return !!(hasIdentifiedData && notAlreadyExecuted);
};

const canDefineImpactArea: ConditionalFunc = (context, event) => {
    // Impact area can only run after identifiedData is populated
    const hasIdentifiedData = context.verificationRequest?.identifiedData;
    const notAlreadyExecuted =
        !context.verificationRequest?.statesExecuted?.includes("impactArea");

    return !!(hasIdentifiedData && notAlreadyExecuted);
};

const canDefineSeverity: ConditionalFunc = (context, event) => {
    // Check if impact area, topics, and identified data (personality) are all defined
    const hasImpactArea = context.verificationRequest?.impactArea;
    const hasTopics =
        context.verificationRequest?.topics &&
        context.verificationRequest?.topics.length > 0;
    const hasIdentifiedData = context.verificationRequest?.identifiedData;

    // All three must be present to proceed with severity definition
    return !!(hasImpactArea && hasTopics && hasIdentifiedData);
};

const getStateInvoke = (
    eventName: VerificationRequestStateMachineEvents,
    stateMachineService: VerificationRequestStateMachineService
): InvokeConfig<any, any> => {
    const getVerificationRequestService = () =>
        stateMachineService.verificationRequestService;
    switch (eventName) {
        case VerificationRequestStateMachineEvents.CREATE:
            return {
                id: eventName,
                src: getStateInvokeSrc(
                    eventName,
                    getVerificationRequestService
                ),
                onDone: [
                    {
                        target: VerificationRequestStateMachineStates.EMBEDDING,
                        actions: assign({
                            result: (context, event: AnyEventObject) => {
                                return event.data;
                            },
                            verificationRequest: (
                                context: any,
                                event: AnyEventObject
                            ) => {
                                return {
                                    id: event.data.id,
                                    ...context.verificationRequest,
                                };
                            },
                        }),
                    },
                ],
                onError: getOnErrorAction(),
            };
        case VerificationRequestStateMachineEvents.EMBED:
            return {
                id: eventName,
                src: getStateInvokeSrc(
                    eventName,
                    getVerificationRequestService
                ),
                onDone: [
                    {
                        // Don't auto-transition - let callbacks handle orchestration
                        target: CommonStateMachineStates.WRAP_UP_EXECUTION,
                        actions: assign({
                            result: (context, event: AnyEventObject) => {
                                return event.data;
                            },
                        }),
                    },
                ],
                onError: getOnErrorAction(),
            };
        case VerificationRequestStateMachineEvents.IDENTIFY_DATA:
            return {
                id: eventName,
                src: getStateInvokeSrc(
                    eventName,
                    getVerificationRequestService
                ),
                onDone: [
                    {
                        // Don't auto-transition to DEFINING_TOPICS - let callbacks handle orchestration
                        target: CommonStateMachineStates.WRAP_UP_EXECUTION,
                        actions: assign({
                            result: (context, event: AnyEventObject) => {
                                return event.data;
                            },
                        }),
                    },
                ],
                onError: getOnErrorAction(),
            };
        case VerificationRequestStateMachineEvents.DEFINE_TOPICS:
            return {
                id: eventName,
                src: getStateInvokeSrc(
                    eventName,
                    getVerificationRequestService
                ),
                onDone: [
                    {
                        // Don't auto-transition - let callbacks handle orchestration
                        target: CommonStateMachineStates.WRAP_UP_EXECUTION,
                        actions: assign({
                            result: (context, event: AnyEventObject) => {
                                return event.data;
                            },
                        }),
                    },
                ],
                onError: getOnErrorAction(),
            };
        case VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA:
            return {
                id: eventName,
                src: getStateInvokeSrc(
                    eventName,
                    getVerificationRequestService
                ),
                onDone: [
                    {
                        // Don't auto-transition - let callbacks handle orchestration
                        target: CommonStateMachineStates.WRAP_UP_EXECUTION,
                        actions: assign({
                            result: (context, event: AnyEventObject) => {
                                return event.data;
                            },
                        }),
                    },
                ],
                onError: getOnErrorAction(),
            };
        case VerificationRequestStateMachineEvents.DEFINE_SEVERITY:
            return {
                id: eventName,
                src: getStateInvokeSrc(
                    eventName,
                    getVerificationRequestService
                ),
                onDone: [
                    {
                        target: CommonStateMachineStates.WRAP_UP_EXECUTION,
                        actions: assign({
                            result: (context, event: AnyEventObject) => {
                                return event.data;
                            },
                        }),
                    },
                ],
                onError: getOnErrorAction(),
            };
        default:
            return {
                id: eventName,
                src: getStateInvokeSrc(
                    eventName,
                    getVerificationRequestService
                ),
                onDone: getOnDoneAction(),
                onError: getOnErrorAction(),
            };
    }
};

const getStateTransitions = (
    originState:
        | VerificationRequestStateMachineStates
        | CommonStateMachineStates
) => {
    switch (originState) {
        case CommonStateMachineStates.REHYDRATE:
            return {
                [VerificationRequestStateMachineEvents.REQUEST]: {
                    target: VerificationRequestStateMachineStates.REQUESTING,
                },
                [VerificationRequestStateMachineEvents.EMBED]: {
                    target: VerificationRequestStateMachineStates.EMBEDDING,
                },
                [VerificationRequestStateMachineEvents.IDENTIFY_DATA]: {
                    target: VerificationRequestStateMachineStates.IDENTIFYING_DATA,
                },
                [VerificationRequestStateMachineEvents.DEFINE_TOPICS]: {
                    target: VerificationRequestStateMachineStates.DEFINING_TOPICS,
                },
                [VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA]: {
                    target: VerificationRequestStateMachineStates.DEFINING_IMPACT_AREA,
                },
                [VerificationRequestStateMachineEvents.DEFINE_SEVERITY]: {
                    target: VerificationRequestStateMachineStates.DEFINING_SEVERITY,
                },
            };
        case VerificationRequestStateMachineStates.EMBEDDING:
            return {
                [VerificationRequestStateMachineEvents.EMBED]: {
                    target: VerificationRequestStateMachineStates.EMBEDDING,
                },
                [VerificationRequestStateMachineEvents.IDENTIFY_DATA]: {
                    target: VerificationRequestStateMachineStates.IDENTIFYING_DATA,
                },
                [VerificationRequestStateMachineEvents.DEFINE_TOPICS]: {
                    target: VerificationRequestStateMachineStates.DEFINING_TOPICS,
                },
                [VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA]: {
                    target: VerificationRequestStateMachineStates.DEFINING_IMPACT_AREA,
                },
                [VerificationRequestStateMachineEvents.DEFINE_SEVERITY]: {
                    target: VerificationRequestStateMachineStates.DEFINING_SEVERITY,
                },
            };
        case VerificationRequestStateMachineStates.IDENTIFYING_DATA:
            return {
                [VerificationRequestStateMachineEvents.IDENTIFY_DATA]: {
                    target: VerificationRequestStateMachineStates.IDENTIFYING_DATA,
                },
            };
        case VerificationRequestStateMachineStates.DEFINING_IMPACT_AREA:
            return {
                [VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA]: {
                    target: VerificationRequestStateMachineStates.DEFINING_IMPACT_AREA,
                },
                [VerificationRequestStateMachineEvents.DEFINE_SEVERITY]: {
                    target: VerificationRequestStateMachineStates.DEFINING_SEVERITY,
                },
            };
        case VerificationRequestStateMachineStates.DEFINING_SEVERITY:
            return {
                [VerificationRequestStateMachineEvents.DEFINE_SEVERITY]: {
                    target: VerificationRequestStateMachineStates.DEFINING_SEVERITY,
                },
            };
        case VerificationRequestStateMachineStates.DEFINING_TOPICS:
            return {
                [VerificationRequestStateMachineEvents.DEFINE_TOPICS]: {
                    target: VerificationRequestStateMachineStates.DEFINING_TOPICS,
                },
                [VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA]: {
                    target: VerificationRequestStateMachineStates.DEFINING_IMPACT_AREA,
                },
            };
        default:
            return {
                on: {},
            };
    }
};
/**
 * TODO: after creation we need trigger other AI tasks to be executed
 */
export const getVerificationRequestStateMachineConfig = (
    stateMachineService: VerificationRequestStateMachineService
) => {
    return {
        id: "verificationRequest",
        initial: CommonStateMachineStates.REHYDRATE,
        states: {
            [CommonStateMachineStates.REHYDRATE]: {
                description:
                    VerificationRequestMessages.DESCRIPTIONS.REQUESTING,
                on: getStateTransitions(CommonStateMachineStates.REHYDRATE),
            },
            [VerificationRequestStateMachineStates.IDENTIFYING_DATA]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.IDENTIFY_DATA,
                    stateMachineService
                ),
                description: VerificationRequestMessages.DESCRIPTIONS.DEFAULT,
            },
            [VerificationRequestStateMachineStates.CREATING]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.CREATE,
                    stateMachineService
                ),
                description: VerificationRequestMessages.DESCRIPTIONS.CREATING,
            },
            [VerificationRequestStateMachineStates.REQUESTING]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.CREATE,
                    stateMachineService
                ),
                description:
                    VerificationRequestMessages.DESCRIPTIONS.REQUESTING,
            },
            [VerificationRequestStateMachineStates.EMBEDDING]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.EMBED,
                    stateMachineService
                ),
                description: VerificationRequestMessages.DESCRIPTIONS.EMBED,
            },
            [VerificationRequestStateMachineStates.IDENTIFYING_PERSONALITY]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.IDENTIFY_DATA,
                    stateMachineService
                ),
                description:
                    VerificationRequestMessages.DESCRIPTIONS.IDENTIFY_DATA,
            },
            [VerificationRequestStateMachineStates.DEFINING_IMPACT_AREA]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA,
                    stateMachineService
                ),
                description:
                    VerificationRequestMessages.DESCRIPTIONS.DEFINE_IMPACT_AREA,
            },
            [VerificationRequestStateMachineStates.DEFINING_SEVERITY]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.DEFINE_SEVERITY,
                    stateMachineService
                ),
                description:
                    VerificationRequestMessages.DESCRIPTIONS.DEFINE_SEVERITY,
            },
            [VerificationRequestStateMachineStates.DEFINING_TOPICS]: {
                invoke: getStateInvoke(
                    VerificationRequestStateMachineEvents.DEFINE_TOPICS,
                    stateMachineService
                ),
                description:
                    VerificationRequestMessages.DESCRIPTIONS.DEFINE_TOPICS,
            },
            [CommonStateMachineStates.ERROR]: {
                description: VerificationRequestMessages.DESCRIPTIONS.ERROR,
                type: "final" as const,
            },
            [CommonStateMachineStates.WRAP_UP_EXECUTION]: {
                type: "final" as const,
            },
        },
        on: {
            "*": {
                actions: "logInvalidEvent",
            },
        },
        schema: verificationRequestStateMachineSchema,
        context: {},
        predictableActionArguments: true,
        preserveActionOrder: true,
    };
};
