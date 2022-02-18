import React from "react";
import api from "../../api/personality";
import { Row } from "antd";
import PersonalityCard from "./PersonalityCard";
import PersonalityCreateCTA from "./PersonalityCreateCTA";
import BaseList from "../List/BaseList";
import { useTranslation } from "next-i18next";

const PersonalityList = () => {
    const { i18n } = useTranslation()
    const createPersonalityCTA = (
        <Row
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%"
            }}
        >
            <PersonalityCreateCTA href="/personality/search" />
        </Row>
    );
    return (
        <BaseList
            apiCall={api.getPersonalities}
            filter={{
                i18n
            }}
            emptyFallback={createPersonalityCTA}
            renderItem={p =>
                p && (
                    <PersonalityCard
                        personality={p}
                        summarized={true}
                        key={p._id}
                    />
                )
            }
            footer={createPersonalityCTA}
        />
    );
}
export default PersonalityList;
