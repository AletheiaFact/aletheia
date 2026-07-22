import React from "react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../public/locales/pt/common.json";

type Props = {
    children: React.ReactNode;
};

export default function TestProviders({ children }: Props) {
    return (
        <NextIntlClientProvider
            locale="pt"
            messages={{
                common: messages,
            }}
        >
            {children}
        </NextIntlClientProvider>
    );
}