import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { ActionTypes } from "../store/types";
import { queries } from "../styles/mediaQueries";

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
        const keys = Object.keys(queries); // [ xs, sm, md, lg, xl ]
        const mediaQueries: QueriesList = {}; // for each size will have a media query object that supports the 'matches' call
        const initialValues = {
            xs: false,
            sm: false,
            md: false,
            lg: false,
            xl: false,
        };

        const updateRedux = (newValues) => {
            dispatch({
                type: ActionTypes.SET_BREAKPOINTS,
                vw: newValues,
            });
        };

        const listener = () => {
            const updateMatches = keys.reduce((results, media) => {
                results[media] =
                    !!mediaQueries[media] && mediaQueries[media].matches;
                return results;
            }, initialValues);
            updateRedux(updateMatches);
        };

        if (window && window.matchMedia) {
            keys.forEach((media) => {
                mediaQueries[media] = window.matchMedia(queries[media]);
                initialValues[media] = mediaQueries[media].matches;
            });

            updateRedux(initialValues);

            keys.forEach((media) => {
                mediaQueries[media].addEventListener("change", listener);
            });
        } else {
            updateRedux(initialValues);
        }
        return () => {
            keys.forEach((media) => {
                mediaQueries[media].removeEventListener("change", listener);
            });
        };
    }, [dispatch]);
}
