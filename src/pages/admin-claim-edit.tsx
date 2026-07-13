import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import EditClaimView from "../components/Claim/EditClaim/EditClaimView";

interface Props {
    claimId: string;
    nameSpace?: string;
}

const AdminClaimEditPage: NextPage<Props> = ({ claimId, nameSpace }) => {
    if (!claimId) return null;
    return <EditClaimView claimId={claimId} nameSpace={nameSpace} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    const resolvedLocale = GetLocale(req, locale, locales);
    const parsed = query?.props ? JSON.parse(query.props) : {};
    const claimId =
        (typeof query?.claimId === "string" ? query.claimId : "") ||
        (typeof parsed.claimId === "string" ? parsed.claimId : "");
    const nameSpace =
        (typeof query?.namespace === "string" ? query.namespace : "") ||
        (typeof parsed.namespace === "string" ? parsed.namespace : "") ||
        null;

    return {
        props: {
            ...(await serverSideTranslations(resolvedLocale)),
            claimId,
            nameSpace,
        },
    };
}

export default AdminClaimEditPage;
