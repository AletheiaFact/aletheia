import React from "react";
import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimCard from "./ClaimCard";
import { useRouter } from "next/router";

const ClaimList = ({ personality }) => {
    const router = useRouter();

    const viewClaim = (id, link = false) => {
        const path = `./${personality._id}/claim/${id}`;
        if (!link) {
            router.push(path);
        } else {
            return path;
        }
    }

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
                        viewClaim={viewClaim}
                    />
                )
            }
        />
    );
}
export default ClaimList;
