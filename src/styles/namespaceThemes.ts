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
    const theme = namespacePalette[namespace] ?? defaultPalette;

    const defaultTitleStyle = {
        fontFamily: '"Noticia Text", serif',
        fontWeight: 500,
        lineHeight: 1.2,
    };

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
            fontWeightRegular: 400,

            h1: { ...defaultTitleStyle },
            h2: { ...defaultTitleStyle },
            h3: { ...defaultTitleStyle },
            h4: { ...defaultTitleStyle },
            h5: { ...defaultTitleStyle },
            h6: { ...defaultTitleStyle },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: fontFaces,
            },
        },
    });
};
