import { useTranslation } from "next-i18next";
import React from "react";
import Seo from "../Seo";
import ClaimList from "./ClaimList";

const ImageClaimListView = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo
                title={t("seo:personalityListTitle")}
                description={t("seo:personalityListDescription")}
            />
            <ClaimList personality={{ _id: null }} />
        </>
    );
};

export default ImageClaimListView;
