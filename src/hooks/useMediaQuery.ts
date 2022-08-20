import { useState, useEffect } from 'react';


/**
 * This hook allows to use media queries outside of styled components or style props
 * @param query in the style of css media queries
 * @returns true if window state matches the query, false otherwise
 * @example useMediaQuery("(max-width: 600px)")
 *  will return true if window width is 600px or smaller and false otherwise
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);

        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => {
            setMatches(media.matches);
        };

        // subscribe to changes in window state
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}
