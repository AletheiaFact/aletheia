import { createTheme } from "@mui/material";
import colors from "./colors";
import { fontFaces } from "./fontfaces";

export const materialTheme = createTheme({
    typography: {
        fontFamily: "Open Sans",
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: fontFaces,
        },
    },
    palette: {
        primary: {
            main: colors.primary,
            light: colors.lightTertiary,
        },
        secondary: {
            main: colors.secondary,
            light: colors.lightSecondary,
        },
    },
});

declare module "@mui/material/styles" {
    interface Theme {
        status: {
            danger: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}
