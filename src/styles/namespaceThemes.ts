import colors from "./colors";
import { createTheme } from "@mui/material";
import { fontFaces } from "./fontfaces";

const namespacePalette = {
    main: {
        primary: colors.primary,
        secondary: colors.secondary,
        tertiary: colors.tertiary,
    },
    test: {
        primary: colors.black,
        secondary: colors.blackSecondary,
        tertiary: colors.blackTertiary,
    },
};

export const AletheiaThemeConfig = (namespace: keyof typeof namespacePalette) =>
    createTheme({
        palette: {
            primary: {
                main: namespacePalette[namespace].primary,
                light: namespacePalette[namespace].secondary,
            },
            secondary: {
                main: namespacePalette[namespace].secondary,
                light: namespacePalette[namespace].tertiary,
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
