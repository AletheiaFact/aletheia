import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { currentAuthentication, currentUserId } from "../atoms/currentUser";
import userApi from "../api/userApi";
import { useTranslation } from "next-i18next";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";

const AalCheckPage = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const [aal] = useAtom(currentAuthentication);
    const [userId] = useAtom(currentUserId);

    const aal2Activated = aal === "aal2";

    const userDataUpdate = async () => {
        try {
            await userApi.updateTotp(userId, { totp: true });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (aal2Activated) {
            userDataUpdate();
        }
    }, [aal]);

    return (
        <div
            style={{
                width: "100%",
                marginTop: "60px",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 600,
            }}
        >
            <div>{t("checkAal:informationUpdated")}</div>
            <a
                href={nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "/"}
                style={{
                    height: "60px",
                    fontSize: "1rem",
                    placeContent: "center",
                }}
            >
                {t("checkAal:goBack")}
            </a>
        </div>
    );
};

export default AalCheckPage;
