import { useTranslations } from "next-intl";
import { NextSeo, NextSeoProps } from "next-seo";
import React from "react";

const Seo = ({ title, ...rest }: NextSeoProps) => {
    const tSeo = useTranslations("seo");
    const defaultTitleLength = tSeo("siteName").length + 3;
    const trimmedTitle = title?.substring(0, 65 - defaultTitleLength) || "";
    return <NextSeo title={trimmedTitle} {...rest} />;
};

export default Seo;
