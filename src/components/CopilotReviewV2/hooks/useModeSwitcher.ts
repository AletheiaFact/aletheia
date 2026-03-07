import { useState, useCallback } from "react";

export type ReviewMode = "chat" | "form";

interface UseModeSwitcherReturn {
    mode: ReviewMode;
    switchMode: (newMode: ReviewMode) => void;
}

export function useModeSwitcher(
    initialMode: ReviewMode = "chat"
): UseModeSwitcherReturn {
    const [mode, setMode] = useState<ReviewMode>(initialMode);

    const switchMode = useCallback(
        (newMode: ReviewMode) => {
            if (newMode !== mode) {
                setMode(newMode);
            }
        },
        [mode]
    );

    return { mode, switchMode };
}
