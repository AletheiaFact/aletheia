import { createMachine, interpret, MachineConfig } from 'xstate'
import { waitFor } from 'xstate/lib/waitFor'
import { Logger } from '@nestjs/common'

export interface StateMachineContext {
    result?: any
    error?: any
    timeout?: number
}
  
export enum CommonStateMachineStates {
    REHYDRATE = 'rehydrateMachine',
    ERROR = 'errorMachine',
    WRAP_UP_EXECUTION = 'wrapUpMachine',
}

export class StateMachineBase<Context extends StateMachineContext> {
  protected stateMachineService: any
  protected stateMachineConfig: (stateMachineService: any) => MachineConfig<any, any, any>
  protected readonly logger = new Logger(StateMachineBase.name)

  constructor(stateMachineService: any) {
    this.stateMachineService = stateMachineService
  }

  async createMachineAndWaitForResult(context: Context, triggerEvent?: string): Promise<any> {
    const stateMachine = createMachine(
      {
        ...this.stateMachineConfig(this.stateMachineService),
        initial: await this.getEntityCurrentState(context),
        context: context,
      },
      {
        actions: {
          logInvalidEvent: (cont, event) => {
            this.logger.error(`Invalid event '${event.type}' in state '${JSON.stringify(cont)}'`)
          },
        },
      },
    )
    return this.interpretMachineAndWaitForResult(stateMachine, triggerEvent)
  }

  private interpretMachineAndWaitForResult = async (stateMachine: any, triggerEventType?: string): Promise<any> => {
    const interpretedMachine = interpret(stateMachine).start()
    let result, error
    interpretedMachine.subscribe((state: any) => {
      switch (state.value) {
        case CommonStateMachineStates.WRAP_UP_EXECUTION:
          result = state.context.result
        case CommonStateMachineStates.ERROR:
          error = state.context.error
      }
    })
    if (triggerEventType) {
      interpretedMachine.send({ type: triggerEventType })
    }

    try {
      await waitFor(
        interpretedMachine,
        (state) =>
          state.matches(CommonStateMachineStates.WRAP_UP_EXECUTION) || state.matches(CommonStateMachineStates.ERROR),
        { timeout: stateMachine?.context?.timeout || 10000 },
      )
    } catch (error) {
      this.logger.error(`Error wait for xstate ${error}`)
      throw error
    }

    if (error) {
      throw error
    }
    return result
  }

  protected getEntityCurrentState(context: Context): string | Promise<string> {
    return CommonStateMachineStates.REHYDRATE
  }
}
