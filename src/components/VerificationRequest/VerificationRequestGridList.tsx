import React from "react";
import GridList from "../GridList";
import { VerificationRequest } from "../../types/VerificationRequest";
import VerificationRequestMinimumCard from "./verificationRequestCards/VerificationRequestMinimumCard";

type VerificationRequestGridProps = {
    verificationRequest: VerificationRequest[];
    title: React.ReactNode;
}

const VerificationRequestGridList = ({ verificationRequest, title, }: VerificationRequestGridProps) => {
    return (
        <GridList
            title={title}
            dataSource={verificationRequest}
            itemSize={{ xs: 12, md: 6 }}
            disableSeeMoreButton={true}
            getKey={(verificationRequest) => verificationRequest._id}
            renderItem={(verificationRequest) => <VerificationRequestMinimumCard verificationRequest={verificationRequest} />}
        />
    );
};

export default VerificationRequestGridList;
