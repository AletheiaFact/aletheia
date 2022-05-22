import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { RouterContext } from "next/dist/shared/lib/router-context";
import colors from '../src/styles/colors';

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    nextRouter: {
        Provider: RouterContext.Provider,
    },
    backgrounds: {
        default: 'light',
        values: [
          { name: 'light', value: "rgb(245,245,245)" },
          { name: 'blue', value: "rgb(17, 39, 58)" },
          { name: 'dark', value: "rgb(81, 81, 81)" },
        ],
      },
};

export const decorators = [
    (Story, { globals }) => (
        <I18nextProvider i18n={i18n}>{Story()}</I18nextProvider>
    ),
];
