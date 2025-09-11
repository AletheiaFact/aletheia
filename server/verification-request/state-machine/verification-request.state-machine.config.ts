import { getOnDoneAction, getOnErrorAction } from './base'
import { AnyEventObject, assign, InvokeConfig } from 'xstate'

import { CommonStateMachineStates } from './base'
import { VerificationRequestMessages, VerificationRequestStateMachineEvents, VerificationRequestStateMachineStates } from '../dto/types'
import { VerificationRequestStateMachineContext, VerificationRequestStateMachineService } from './verification-request.state-machine.interface'
import { VerificationRequestService } from '../verification-request.service'


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
                return getVerificationRequestService().embeddingContent(context.verificationRequest.content)
            }
        default:
            return async (context: VerificationRequestStateMachineContext, event, meta) => {
                return {}
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
        case VerificationRequestStateMachineEvents.EMBED:
            return {
                id: eventName,
                src: getStateInvokeSrc(eventName, getVerificationRequestService),
                onDone: [
                    {
                        target: VerificationRequestStateMachineStates.CREATING,
                        actions: assign({
                            result: (context, event: AnyEventObject) => {
                                return event.data
                            },
                            verificationRequest: (context: any, event: AnyEventObject) => {
                                return { ...event.data, ...context.verificationRequest }
                            },
                        }),
                    }
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
                invoke: getStateInvoke(VerificationRequestStateMachineEvents.EMBED, stateMachineService),
                description: VerificationRequestMessages.DESCRIPTIONS.REQUESTING,
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
