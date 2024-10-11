import { useState, useEffect } from "react";
import { useRemirrorContext } from "@remirror/react";

export const usePluginReady = (pluginName, enableEditorAnnotations) => {
    const [isPluginReady, setPluginReady] = useState(false);
    const { getPluginState } = useRemirrorContext({ autoUpdate: true });

    // Polling to ensure the annotation plugin is fully initialized before using it.
    // This is necessary because the plugin might load slower than the rest of the page,
    // which could cause errors when trying to access it prematurely.
    useEffect(() => {
        if (enableEditorAnnotations) {
            const interval = setInterval(() => {
                const pluginState = getPluginState(pluginName);
                if (pluginState) {
                    setPluginReady(true);
                    clearInterval(interval);
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, [pluginName, enableEditorAnnotations, getPluginState]);

    return isPluginReady;
};
