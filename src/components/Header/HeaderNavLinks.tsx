import { Link } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../types/Namespace";

const HeaderNavLinks = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const baseHref = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    return (
        <>
            <Link
                href={`${baseHref}/personality`}
                className="navLink"
                underline="none"
            >
                {t("menu:personalityItem")}
            </Link>
            <Link
                href={`${baseHref}/claim`}
                className="navLink"
                underline="none"
            >
                {t("menu:claimItem")}
            </Link>
            <Link
                href={`${baseHref}/verification-request`}
                className="navLink"
                underline="none"
            >
                {t("menu:verificationRequestItem")}
            </Link>
        </>
    );
};

export default HeaderNavLinks;
