import { useTranslation } from "next-i18next";
import React from "react";

import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import ClaimCard from "./ClaimCard";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import ClaimListEmptyFallBack from "./ClaimListEmptyFallBack";

const ClaimList = ({ personality, columns = 6 }) => {
    const { i18n, t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    return (
        <BaseList
            apiCall={claimApi.get}
            filter={{ personality: personality._id, i18n, nameSpace }}
            title={t("claim:claimListHeader")}
            showDividers={false}
            bluePrimary={true}
            grid={{
                xs: 12,
                sm: columns,
            }}
            emptyFallback={<ClaimListEmptyFallBack personality={personality} />}
            renderItem={(claim) =>
                claim && (
                    <ClaimCard
                        key={claim._id}
                        personality={personality}
                        claim={claim}
                    />
                )
            }
            skeleton={<ClaimSkeleton />}
        />
    );
};
export default ClaimList;
