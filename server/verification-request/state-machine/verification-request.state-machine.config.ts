import { getOnDoneAction, getOnErrorAction } from '' // create this file
import { AnyEventObject, assign, InvokeConfig } from 'xstate'

import { CommonStateMachineStates } from './base'
import { VerificationRequestMessages, VerificationRequestStateMachineEvents, VerificationRequestStateMachineStates } from '../dto/types'
import { VerificationRequestStateMachineContext, VerificationRequestStateMachineService } from './verification-request.state-machine.interface'
import { VerificationRequestService } from '../verification-request.service'


const verificationRequestStateMachineSchema = {
  context: {} as VerificationRequestStateMachineContext,
  events: {} as
    | { type: VerificationRequestStateMachineEvents.CREATE }
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
    // case VerificationRequestStateMachineEvents.REQUEST:
    //   return async (context: VerificationRequestStateMachineContext, event, meta) => {
    //     return getVerificationRequestService().request(context.verificationRequest as RequestVerificationRequestRequestType)
    //   }
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
            [VerificationRequestStateMachineEvents.CREATE]: {
                target: VerificationRequestStateMachineStates.EMBEDDING,
            },
        }
    case VerificationRequestStateMachineStates.EMBEDDING:
        return {
            [VerificationRequestStateMachineEvents.CREATE]: {
                target: VerificationRequestStateMachineStates.EMBEDDING,
            },
        }
    case VerificationRequestStateMachineStates.FINISHED:
      return {
        [VerificationRequestStateMachineEvents.CREATE]: {
          target: VerificationRequestStateMachineStates.EDITING,
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
        description: VerificationRequestMessages.DESCRIPTIONS.PLANNING,
        on: getStateTransitions(CommonStateMachineStates.REHYDRATE),
      },
      [VerificationRequestStateMachineStates.EMBEDDING]: {
        invoke: getStateInvoke(VerificationRequestStateMachineEvents.CREATE, stateMachineService),
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
