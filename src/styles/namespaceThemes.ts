import colors from "./colors";
import { createTheme } from "@mui/material";
import { fontFaces } from "./fontfaces";

const namespacePalette = {
    main: {
        primary: colors.primary,
        secondary: colors.secondary,
        tertiary: colors.tertiary,
    },
    otherNamespace: {
        primary: colors.secondary,
        secondary: colors.secondary,
        tertiary: colors.secondary,
    },
};

const defaultPalette = namespacePalette.otherNamespace;

export const AletheiaThemeConfig = (namespace: string) => {
    const theme = namespacePalette[namespace] || defaultPalette;

    return createTheme({
        palette: {
            primary: {
                main: theme.primary,
                light: theme.secondary,
            },
            secondary: {
                main: theme.secondary,
                light: theme.tertiary,
            },
        },
        typography: {
            fontFamily: "Open Sans",
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: fontFaces,
            },
        },
    });
};
