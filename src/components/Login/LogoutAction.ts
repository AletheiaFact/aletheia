import { ory } from '../../lib/orysdk'

export async function CreateLogoutHandler() {
  
    const {data} = await ory
      .createSelfServiceLogoutFlowUrlForBrowsers()
      await ory
      .submitSelfServiceLogoutFlow(data.logout_token)
  }
