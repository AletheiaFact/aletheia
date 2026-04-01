import {
    NoteAdd,
    AddCircle,
    AddOutlined,
    PersonAddAlt1Outlined,
    Source,
    Report,
    Event
    // Source,
} from "@mui/icons-material";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { Trans, useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { currentUserRole, isUserLoggedIn } from "../../atoms/currentUser";

import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";
import { AletheiaModal } from "../Modal/AletheiaModal.style";
import PulseAnimation from "../PulseAnimation";
import Fab from "./Fab";
import { NameSpaceEnum } from "../../types/Namespace";
import { currentNameSpace } from "../../atoms/namespace";
import { useAppSelector } from "../../store/store";

interface AffixButtonProps {
    personalitySlug?: string;
    bottom?: string
    enableEventsFeature?: boolean;
}

/*** Floating action button that displays the Create Personality option
 * @param personalitySlug if present will display the Create Claim option too
 */
const AffixButton = ({ personalitySlug, bottom, enableEventsFeature }: AffixButtonProps) => {
    const { vw, copilotDrawerCollapsed, reviewDrawerCollapsed } =
        useAppSelector((state) => ({
            vw: state?.vw,
            copilotDrawerCollapsed: state?.copilotDrawerCollapsed ?? true,
            reviewDrawerCollapsed: state?.reviewDrawerCollapsed ?? true,
        }));
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userRole] = useAtom(currentUserRole);
    const [nameSpace] = useAtom(currentNameSpace);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const { t } = useTranslation();
    const bottomValue = bottom ?? "3%";

    const actions = [
        {
            icon: <PersonAddAlt1Outlined />,
            tooltip: t("affix:affixButtonCreatePersonality"),
            href:
                nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/personality/search`
                    : `/personality/search`,
            dataCy: "testFloatButtonAddPersonality",
        },
    ];

    const hrefPersonalitySlug = personalitySlug
        ? `?personality=${personalitySlug}`
        : "";

    if (userRole !== "regular") {
        actions.push(
            {
                icon: <NoteAdd />,
                tooltip: t("affix:affixButtonCreateClaim"),
                href: nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/claim/create${hrefPersonalitySlug}`
                    : `/claim/create${hrefPersonalitySlug}`,
                dataCy: "testFloatButtonAddClaim",
            },

            // Temporarily removing the "add checked information" button from the affixbutton.
            // {
            //     icon: <Source />,
            //     tooltip: t("affix:affixButtonCreateVerifiedSources"),
            //     href:
            //         nameSpace !== NameSpaceEnum.Main
            //             ? `/${nameSpace}/source/create`
            //             : `/source/create`,
            //     dataCy: "testFloatButtonAddSources",
            // },

            {
                icon: <Report />,
                tooltip: t("affix:affixButtonCreateVerificationRequest"),
                href: nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/verification-request/create`
                    : `/verification-request/create`,
                dataCy: "testFloatButtonAddVerificationRequest",
            }
        );

        if (enableEventsFeature) {
            actions.push({
                icon: <Event />,
                tooltip: t("affix:affixButtonCreateEvent"),
                href: nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/event/create`
                    : `/event/create`,
                dataCy: "testFloatButtonAddEvent",
            });
        }
    }

    useEffect(() => {
        const tutorialShown = Cookies.get("tutorial_shown") || false;
        setIsModalVisible(!tutorialShown);
    }, []);

    const handleHideModal = () => {
        Cookies.set("tutorial_shown", "true");
        setIsModalVisible(false);
    };

    const toggleFloatingdrawer = () => {
        setIsOptionsVisible((value) => !value);
    };

    const handleClick = () => {
        if (isModalVisible) {
            handleHideModal();
        }
        toggleFloatingdrawer();
    };

    if (!isLoggedIn || !reviewDrawerCollapsed) {
        return null;
    }

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    bottom: bottomValue,
                    right:
                        copilotDrawerCollapsed || vw?.md
                            ? "2%"
                            : `calc(2% + 350px)`,
                    display: "flex",
                    flexDirection: "column-reverse",
                    alignItems: "center",
                    gap: "1rem",
                    zIndex: 9999,
                }}
            >
                <PulseAnimation
                    pulse={isModalVisible}
                    startColor={colors.secondary}
                    endColor={
                        nameSpace === NameSpaceEnum.Main
                            ? colors.primary
                            : colors.secondary
                    }
                    startSize={0}
                    endSize={65}
                    style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "100%",
                    }}
                >
                    <Fab
                        tooltipText={t(
                            userRole !== "regular"
                                ? "affix:affixButtonTitle"
                                : "affix:affixButtonCreatePersonality"
                        )}
                        size="70px"
                        onClick={handleClick}
                        data-cy={"testFloatButton"}
                        icon={<AddOutlined fontSize="large" />}
                    />
                </PulseAnimation>

                {isOptionsVisible &&
                    actions.map((action) => (
                        <Fab
                            key={action.href}
                            tooltipText={action.tooltip}
                            icon={action.icon}
                            href={action.href}
                            size="50px"
                            data-cy={action.dataCy}
                        />
                    ))}
            </div>
            <AletheiaModal
                open={isModalVisible}
                onCancel={handleHideModal}
                title={
                    <h2
                        style={{
                            fontFamily: "open sans, sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                            textAlign: "center",
                            textTransform: "uppercase",
                            padding: "0 34px",
                        }}
                    >
                        {t("tutorial:modalTitle")}
                    </h2>
                }
            >
                <p
                    style={{
                        fontWeight: 600,
                        width: "100%",
                        textAlign: "center",
                        color: colors.blackSecondary,
                    }}
                >
                    <Trans
                        i18nKey={"tutorial:modalContent"}
                        components={[
                            <AddCircle
                                style={{
                                    marginBottom: "-5px",
                                    fontSize: "18px",
                                }}
                                key={"icon"}
                            />,
                        ]}
                    />
                </p>

                <div
                    style={{
                        marginTop: 24,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <AletheiaButton
                        type={ButtonType.blue}
                        onClick={handleHideModal}
                        data-cy={"testButtonTutorialOk"}
                    >
                        {t("tutorial:okButton")}
                    </AletheiaButton>
                </div>
            </AletheiaModal>
        </>
    );
};

export default AffixButton;
