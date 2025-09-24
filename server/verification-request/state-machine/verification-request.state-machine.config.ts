import { getOnDoneAction, getOnErrorAction } from './base'
import { AnyEventObject, assign, InvokeConfig } from 'xstate'

import { CommonStateMachineStates } from './base'
import { VerificationRequestMessages, VerificationRequestStateMachineEvents, VerificationRequestStateMachineStates } from '../dto/types'
import { VerificationRequestStateMachineContext, VerificationRequestStateMachineService } from './verification-request.state-machine.interface'
import { VerificationRequestService } from '../verification-request.service'
import { CreateAiTaskDto } from '../../ai-task/dto/create-ai-task.dto'
import { AiTaskType, CallbackRoute, DEFAULT_EMBEDDING_MODEL } from '../../ai-task/constants/ai-task.constants'


const verificationRequestStateMachineSchema = {
  context: {} as VerificationRequestStateMachineContext,
  events: {} as
    | { type: VerificationRequestStateMachineEvents.CREATE }
    | { type: VerificationRequestStateMachineEvents.EMBED }
    | { type: VerificationRequestStateMachineEvents.IDENTIFY_DATA }
    | { type: VerificationRequestStateMachineEvents.DEFINE_TOPICS }
    | { type: VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA }
    | { type: VerificationRequestStateMachineEvents.DEFINE_SEVERITY }
}

const getStateInvokeSrc = (
  eventName: string,
  getVerificationRequestService: () => VerificationRequestService,
): InvokeConfig<any, any>['src'] => {
    switch (eventName) {
        case VerificationRequestStateMachineEvents.CREATE:
            return async (context: VerificationRequestStateMachineContext, event, meta) => {
                return getVerificationRequestService().create(context.verificationRequest)
            }
        case VerificationRequestStateMachineEvents.EMBED:
            return async (context: VerificationRequestStateMachineContext, event, meta) => {
                const taskDto: CreateAiTaskDto = {
                    type: AiTaskType.TEXT_EMBEDDING,
                    content: {
                        text: context.verificationRequest.content,
                        model: DEFAULT_EMBEDDING_MODEL,
                    },
                    callbackRoute: CallbackRoute.VERIFICATION_UPDATE_EMBEDDING,
                    callbackParams: {
                        targetId: context.verificationRequest.id,
                        field: "embedding",
                    },
                };
                await getVerificationRequestService().createAiTask(taskDto)
                return context.result
            }
        default:
            return async (context: VerificationRequestStateMachineContext, event, meta) => {
                return
            }
    }
}

type ConditionalFunc = (context: any, event: any) => boolean
// TODO: add conditional functions

const getStateInvoke = (
  eventName: VerificationRequestStateMachineEvents,
  stateMachineService: VerificationRequestStateMachineService,
): InvokeConfig<any, any> => {
    const getVerificationRequestService = () => stateMachineService.verificationRequestService
    switch (eventName) {
        case VerificationRequestStateMachineEvents.CREATE:
            return {
                id: eventName,
                src: getStateInvokeSrc(eventName, getVerificationRequestService),
                onDone: [
                {
                    target: VerificationRequestStateMachineStates.EMBEDDING,
                    actions: assign({
                        result: (context, event: AnyEventObject) => {
                            return event.data
                        },
                        verificationRequest: (context: any, event: AnyEventObject) => {
                            return { id: event.data.id, ...context.verificationRequest }
                        },
                    }),
                },
                ],
                onError: getOnErrorAction(),
            }
        default:
            return {
                id: eventName,
                src: getStateInvokeSrc(eventName, getVerificationRequestService),
                onDone: getOnDoneAction(),
                onError: getOnErrorAction(),
              }
    }
}

const getStateTransitions = (originState: VerificationRequestStateMachineStates | CommonStateMachineStates) => {
    switch (originState) {
        case CommonStateMachineStates.REHYDRATE:
            return {
                [VerificationRequestStateMachineEvents.REQUEST]: {
                    target: VerificationRequestStateMachineStates.REQUESTING,
                },
                [VerificationRequestStateMachineEvents.EMBED]: {
                    target: VerificationRequestStateMachineStates.EMBEDDING,
                },
            }
        case VerificationRequestStateMachineStates.EMBEDDING:
            return {
                [VerificationRequestStateMachineEvents.EMBED]: {
                    target: VerificationRequestStateMachineStates.EMBEDDING,
                },
            }
        case VerificationRequestStateMachineStates.IDENTIFYING_DATA:
            return {
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
            }
        default:
            return {
                on: {},
            }
    }
}

export const getVerificationRequestStateMachineConfig = (stateMachineService: VerificationRequestStateMachineService) => {
    return {
        id: 'verificationRequest',
        initial: CommonStateMachineStates.REHYDRATE,
        states: {
            [CommonStateMachineStates.REHYDRATE]: {
                description: VerificationRequestMessages.DESCRIPTIONS.REQUESTING,
                on: getStateTransitions(CommonStateMachineStates.REHYDRATE),
            },
            [VerificationRequestStateMachineStates.IDENTIFYING_DATA]: {
                invoke: getStateInvoke(VerificationRequestStateMachineEvents.IDENTIFY_DATA, stateMachineService),
                description: VerificationRequestMessages.DESCRIPTIONS.DEFAULT,
            },
            [VerificationRequestStateMachineStates.CREATING]: {
                invoke: getStateInvoke(VerificationRequestStateMachineEvents.CREATE, stateMachineService),
                description: VerificationRequestMessages.DESCRIPTIONS.CREATING,
            },
            [VerificationRequestStateMachineStates.REQUESTING]: {
                invoke: getStateInvoke(VerificationRequestStateMachineEvents.CREATE, stateMachineService),
                description: VerificationRequestMessages.DESCRIPTIONS.REQUESTING,
            },
            [VerificationRequestStateMachineStates.EMBEDDING]: {
                invoke: getStateInvoke(VerificationRequestStateMachineEvents.EMBED, stateMachineService),
                description: VerificationRequestMessages.DESCRIPTIONS.EMBED,
            },
            [CommonStateMachineStates.ERROR]: {
                description: VerificationRequestMessages.DESCRIPTIONS.ERROR,
                type: 'final' as const,
            },
            [CommonStateMachineStates.WRAP_UP_EXECUTION]: {
                type: 'final' as const,
            },
        },
        on: {
            '*': {
                actions: 'logInvalidEvent',
            },
        },
        schema: verificationRequestStateMachineSchema,
        context: {},
        predictableActionArguments: true,
        preserveActionOrder: true,
    }
}
