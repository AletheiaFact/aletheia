import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { useState, useEffect, DependencyList } from 'react'

import { ory } from '../../lib/orysdk'

export function createLogoutHandler(deps?: DependencyList) {
  const [logoutToken, setLogoutToken] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    ory
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            return
        }

        return Promise.reject(err)
      })
  }, deps)

  return () => {
    if (logoutToken) {
      ory
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(() => router.push("/login"))
        .then(() => router.reload())
    }
  }
}
