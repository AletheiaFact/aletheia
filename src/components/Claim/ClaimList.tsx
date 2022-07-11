import { useTranslation } from "next-i18next";
import React from "react";

import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimCard from "./ClaimCard";

const ClaimList = ({ personality }) => {
    const { i18n, t } = useTranslation();

    return (
        <BaseList
            apiCall={claimApi.get}
            filter={{ personality: personality._id, i18n }}
            title={t("personality:speechesListHeader")}
            grid={{
                gutter: 20,
                // sizes not declared will show 1 column (xs and sm)
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
            }}
            renderItem={(claim) =>
                claim && (
                    <ClaimCard
                        key={claim._id}
                        personality={personality}
                        claim={claim}
                    />
                )
            }
        />
    );
};
export default ClaimList;
