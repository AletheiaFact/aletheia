import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { ActionTypes } from "../store/types";

export interface WidthBreakpoints {
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
}

interface QueriesList {
    [key: string]: MediaQueryList;
}

/**
 * This hook watches for media query changes and
 * update the breakpoints on the redux state
 */
export function useMediaQueryBreakpoints(): void {
    const dispatch = useDispatch();

    useEffect(() => {
        const maxWidth = {
            xs: 576,
            sm: 768,
            md: 992,
            lg: 1200,
        };
        const queries = {
            xs: `(max-width: ${maxWidth.xs - 1}px)`,
            sm: `(max-width: ${maxWidth.sm - 1}px)`,
            md: `(max-width: ${maxWidth.md - 1}px)`,
            lg: `(max-width: ${maxWidth.lg - 1}px)`,
            xl: `(min-width: ${maxWidth.lg}px)`,
        };
        const keys = Object.keys(queries); // [ xs, sm, md, lg, xl ]
        const mediaQueries: QueriesList = {}; // for each size will have a media query object that supports the 'matches' call
        const initialValues = {
            xs: false,
            sm: false,
            md: false,
            lg: false,
            xl: false,
        };

        const listener = () => {
            const updateMatches = keys.reduce((results, media) => {
                results[media] =
                    !!mediaQueries[media] && mediaQueries[media].matches;
                return results;
            }, initialValues);
            dispatch({
                type: ActionTypes.SET_BREAKPOINTS,
                breakpoints: updateMatches,
            });
        };
        if (window && window.matchMedia) {
            keys.forEach((media) => {
                mediaQueries[media] = window.matchMedia(queries[media]);
                initialValues[media] = mediaQueries[media].matches;
            });

            dispatch({
                type: ActionTypes.SET_BREAKPOINTS,
                breakpoints: initialValues,
            });

            keys.forEach((media) => {
                mediaQueries[media].addEventListener("change", listener);
            });
        }

        return () => {
            keys.forEach((media) => {
                mediaQueries[media].removeEventListener("change", listener);
            });
        };
    }, [dispatch]);
}
