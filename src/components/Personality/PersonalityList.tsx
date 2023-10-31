import { Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import api from "../../api/personality";
import BaseList from "../List/BaseList";
import Seo from "../Seo";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import PersonalityCard from "./PersonalityCard";
import PersonalityCreateCTA from "./PersonalityCreateCTA";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const PersonalityList = () => {
    const { i18n, t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const createPersonalityCTA = (
        <Row
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            <PersonalityCreateCTA
                href={
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}/personality/search`
                        : "/personality/search"
                }
            />
        </Row>
    );
    return (
        <>
            <Seo
                title={t("seo:personalityListTitle")}
                description={t("seo:personalityListDescription")}
            />
            <BaseList
                apiCall={api.getPersonalities}
                filter={{
                    i18n,
                    nameSpace,
                }}
                emptyFallback={createPersonalityCTA}
                renderItem={(p) =>
                    p && (
                        <PersonalityCard
                            personality={p}
                            summarized={true}
                            key={p._id}
                        />
                    )
                }
                footer={createPersonalityCTA}
                skeleton={<PersonalitySkeleton />}
            />
        </>
    );
};
export default PersonalityList;
