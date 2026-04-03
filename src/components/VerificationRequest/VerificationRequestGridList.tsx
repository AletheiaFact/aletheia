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
            loggedInMaxColumns={12}
            disableSeeMoreButton={true}
            renderItem={(verificationRequest) => <VerificationRequestMinimumCard verificationRequest={verificationRequest} />}
        />
    );
};

export default VerificationRequestGridList;
