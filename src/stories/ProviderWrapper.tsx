import React, { useMemo } from "react"
import { Provider } from "react-redux"
import { useStore } from "../store/store"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { AletheiaThemeConfig } from "../styles/namespaceThemes"
import { NameSpaceEnum } from "../types/Namespace"
import { useAtom } from "jotai"
import { currentNameSpace } from "../atoms/namespace"

const ProviderWrapper = ({ children }) => {
    const store = useStore()
    const [nameSpace] = useAtom(currentNameSpace);

    const safeNamespace = nameSpace || NameSpaceEnum.Main;

    const namespaceTheme = useMemo(
        () => AletheiaThemeConfig(safeNamespace),
        [safeNamespace]
    );

    return (
        <Provider store={store}>
            <ThemeProvider theme={namespaceTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </Provider>
    )
}

export default ProviderWrapper
