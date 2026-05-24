import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import EditClaimView from "../components/Claim/EditClaim/EditClaimView";

interface Props {
    claimId: string;
}

const AdminClaimEditPage: NextPage<Props> = ({ claimId }) => {
    if (!claimId) return null;
    return <EditClaimView claimId={claimId} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    const resolvedLocale = GetLocale(req, locale, locales);
    const parsed = query?.props ? JSON.parse(query.props) : {};
    const claimId =
        (typeof query?.claimId === "string" ? query.claimId : "") ||
        (typeof parsed.claimId === "string" ? parsed.claimId : "");

    return {
        props: {
            ...(await serverSideTranslations(resolvedLocale)),
            claimId,
        },
    };
}

export default AdminClaimEditPage;
