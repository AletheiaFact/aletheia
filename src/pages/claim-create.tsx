import { Provider as CreateClaimMachineProvider, useSetAtom } from "jotai";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";

import AffixButton from "../components/AffixButton/AffixButton";
import CreateClaimView from "../components/Claim/CreateClaim/CreateClaimView";
import Seo from "../components/Seo";
import {
    claimPersonalities,
    claimVerificationRequests,
} from "../machines/createClaim/provider";
import actions from "../store/actions";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";

const ClaimCreatePage: NextPage<any> = ({
    sitekey,
    personality,
    nameSpace,
    verificationRequestGroup,
}) => {
    const { t } = useTranslation();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    return (
        <>
            <Seo
                title={t("seo:claimCreateTitle")}
                description={t("seo:claimCreateDescription", {
                    name: personality.name,
                })}
            />
            <CreateClaimMachineProvider
                //@ts-ignore
                initialValues={[
                    [claimPersonalities, personality ? [personality] : []],
                    [
                        claimVerificationRequests,
                        verificationRequestGroup
                            ? verificationRequestGroup
                            : null,
                    ],
                    [currentNameSpace, nameSpace],
                ]}
            >
                <CreateClaimView />
                <AffixButton />
            </CreateClaimMachineProvider>
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: query?.personality
                ? JSON.parse(JSON.stringify(query?.personality))
                : "",
            verificationRequestGroup: query?.verificationRequestGroup
                ? JSON.parse(JSON.stringify(query?.verificationRequestGroup))
                : "",
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default ClaimCreatePage;
