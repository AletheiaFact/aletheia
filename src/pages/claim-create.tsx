import { Provider as CreateClaimMachineProvider, useSetAtom } from "jotai";
import { NextPage } from "next";
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
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const ClaimCreatePage: NextPage<any> = ({
    sitekey,
    personality,
    nameSpace,
    verificationRequestGroup,
}) => {
    const tSeo = useTranslations("seo");
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    return (
        <>
            <Seo
                title={tSeo("claimCreateTitle")}
                description={tSeo("claimCreateDescription", {
                    name: personality.name,
                })}
            />
            <CreateClaimMachineProvider
                initialValues={
                    [
                        [claimPersonalities, personality ? [personality] : []],
                        [claimVerificationRequests, verificationRequestGroup],
                        [currentNameSpace, nameSpace],
                    ] as Iterable<readonly [unknown, unknown]>
                }
            >
                <CreateClaimView />
                <AffixButton />
            </CreateClaimMachineProvider>
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
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
