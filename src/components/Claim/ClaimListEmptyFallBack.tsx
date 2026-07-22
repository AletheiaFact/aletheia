import React from "react";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { useAtom } from "jotai";
import { currentUserRole } from "../../atoms/currentUser";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import { useRouter } from "next/router";
import { Roles } from "../../types/enums";
import CardBase from "../CardBase";
import { useTranslations } from "next-intl";

interface ClaimListEmptyFallBackProps {
    personality: any;
}

const ClaimListEmptyFallBack = ({
    personality,
}: ClaimListEmptyFallBackProps) => {
    const [userRole] = useAtom(currentUserRole);
    const [nameSpace] = useAtom(currentNameSpace);
    const tPersonality = useTranslations("personality");
    const router = useRouter();

    const hrefPersonalitySlug = personality.slug
        ? `?personality=${personality.slug}`
        : "";
    const handleClick = () => {
        const href =
            nameSpace !== NameSpaceEnum.Main
                ? `/${nameSpace}/claim/create${hrefPersonalitySlug}`
                : `/claim/create${hrefPersonalitySlug}`;
        router.push(href);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <CardBase
                style={{
                    display: "block",
                    padding: "10px",
                }}
            >
                <span
                    style={{
                        display: "block",
                        padding: "15px",
                    }}
                >
                    {personality.slug
                        ? tPersonality("claimListEmptyFallBackPersonality")
                        : tPersonality("claimListEmptyFallBack")}
                </span>
                {userRole === Roles.Regular ? null : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <AletheiaButton
                            type={ButtonType.primary}
                            onClick={handleClick}
                        >
                            {tPersonality("claimListEmptyFallBack")}
                        </AletheiaButton>
                    </div>
                )}
            </CardBase>
        </div>
    );
};

export default ClaimListEmptyFallBack;
