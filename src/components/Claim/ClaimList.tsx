import React from "react";
import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimCard from "./ClaimCard";
import { useTranslation } from "next-i18next";

const ClaimList = ({ personality }) => {
    const { i18n } = useTranslation()
    
    return (
        <BaseList
            apiCall={claimApi.get}
            filter={{ personality: personality._id, i18n }}
            renderItem={claim =>
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
}
export default ClaimList;
