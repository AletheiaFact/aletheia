import { useTranslation } from "next-i18next";
import { NextSeo, NextSeoProps } from "next-seo";
import React from "react";

const Seo = ({ title, ...rest }: NextSeoProps) => {
    const { t } = useTranslation();
    const defaultTitleLength = t("seo:siteName").length + 3;
    const trimmedTitle = title.substring(0, 65 - defaultTitleLength) || "";
    return <NextSeo title={trimmedTitle} {...rest} />;
};

export default Seo;
