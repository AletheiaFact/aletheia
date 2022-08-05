import React from "react";
import api from "../../api/personality";
import { Row } from "antd";
import PersonalityCard from "./PersonalityCard";
import PersonalityCreateCTA from "./PersonalityCreateCTA";
import BaseList from "../List/BaseList";
import { useTranslation } from "next-i18next";
import { NextSeo } from "next-seo";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";

const PersonalityList = () => {
    const { i18n, t } = useTranslation();
    const createPersonalityCTA = (
        <Row
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            <PersonalityCreateCTA href="/personality/search" />
        </Row>
    );
    return (
        <>
            <NextSeo
                title={t("seo:personalityListTitle")}
                description={t("seo:personalityListDescription")}
            />
            <BaseList
                apiCall={api.getPersonalities}
                filter={{
                    i18n,
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
