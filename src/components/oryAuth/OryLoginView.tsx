import { useRouter } from "next/router"
import { useEffect } from "react"
import {edgeConfig} from "@ory/integrations/next";


const OryLoginView = () => {
    const router = useRouter()

    useEffect(() => {
        router.push(edgeConfig.basePath + '/ui/login')
    })
}

export default OryLoginView
