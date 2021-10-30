import React from "react";
import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimCard from "./ClaimCard";

const ClaimList = ({ personality }) => {

    return (
        <BaseList
            apiCall={claimApi.get}
            filter={{ personality: personality._id }}
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
