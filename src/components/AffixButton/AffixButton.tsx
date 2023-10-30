import {
    FileAddFilled,
    PlusCircleFilled,
    PlusOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
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
interface AffixButtonProps {
    personalitySlug?: string;
}

/*** Floating action button that displays the Create Personality option
 * @param personalitySlug if present will display the Create Claim option too
 */
const AffixButton = ({ personalitySlug }: AffixButtonProps) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userRole] = useAtom(currentUserRole);
    const [nameSpace] = useAtom(currentNameSpace);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const { t } = useTranslation();
    const actions = [
        {
            icon: <UserAddOutlined />,
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

    userRole !== "regular" &&
        actions.push({
            icon: <FileAddFilled />,
            tooltip: t("affix:affixButtonCreateClaim"),
            href:
                nameSpace !== NameSpaceEnum.Main
                    ? `/${nameSpace}/claim/create${hrefPersonalitySlug}`
                    : `/claim/create${hrefPersonalitySlug}`,
            dataCy: "testFloatButtonAddClaim",
        });

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

    if (!isLoggedIn) {
        return null;
    }

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    bottom: "3%",
                    right: "2%",
                    display: "flex",
                    flexDirection: "column-reverse",
                    alignItems: "center",
                    gap: "1rem",
                    zIndex: 9999,
                }}
            >
                <PulseAnimation
                    pulse={isModalVisible}
                    startColor={colors.blueSecondary}
                    endColor={
                        nameSpace === NameSpaceEnum.Main
                            ? colors.bluePrimary
                            : colors.blueSecondary
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
                        icon={
                            <PlusOutlined
                                style={{
                                    fontSize: "27px",
                                }}
                            />
                        }
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
                className="ant-modal-content"
                open={isModalVisible}
                footer={false}
                onCancel={handleHideModal}
                centered
                title={t("tutorial:modalTitle")}
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
                        components={[<PlusCircleFilled key={"icon"} />]}
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
