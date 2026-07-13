import React from "react";

import claimApi from "../../api/claimApi";
import BaseList from "../List/BaseList";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import ClaimCard from "./ClaimCard";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import ClaimListEmptyFallBack from "./ClaimListEmptyFallBack";
import { useTranslations, useLocale } from "next-intl";

const ClaimList = ({ personality, columns = 6 }) => {
    const locale = useLocale();
    const tClaim = useTranslations("claim");
    const [nameSpace] = useAtom(currentNameSpace);
    console.log("ClaimList personality", personality._id, "locale", locale, "nameSpace", nameSpace);
    console.log("Claimapi.get", claimApi.get);
    return (
        <BaseList
            apiCall={claimApi.get}
            filter={{ personality: personality._id, locale, nameSpace }}
            title={tClaim("claimListHeader")}
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
