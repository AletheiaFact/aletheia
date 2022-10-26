import React from "react";
import { Col, List, Row } from "antd";
import PersonalityCard from "./PersonalityCard";
import { useTranslation } from "next-i18next";
import Button, { ButtonType } from "../Button";
import { ArrowRightOutlined } from "@ant-design/icons";
import SectionTitle from "../SectionTitle";
import { useAppSelector } from "../../store/store";
import GridList from "../GridList";

const PersonalitiesGrid = ({ personalities, title }) => {
    const { t } = useTranslation();
    return (
        <GridList
            title={title}
            dataSource={personalities}
            loggedInMaxColumns={2}
            seeMoreButtonLabel={t("home:seeMorePersonalitiesButton")}
            renderItem={(p) => (
                <PersonalityCard personality={p} summarized={true} />
            )}
        />
    );
};

export default PersonalitiesGrid;
