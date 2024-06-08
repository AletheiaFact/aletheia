import React from "react";
import SourceApi from "../../api/sourceApi";
import BaseList from "../List/BaseList";
import SourceSkeleton from "../Skeleton/SourceSkeleton";
import SourceListItem from "./SourceListItem";
import AletheiaButton from "../Button";
import { Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const SourceList = ({ footer = false }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const SourceCreateCTAButton = (
        <Row
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginBottom: 16,
            }}
        >
            <p>
                <b>{t("personalityCTA:header")}</b>
            </p>

            <p>
                <AletheiaButton
                    href={`./sources/create`}
                    data-cy="testButtonCreatePersonality"
                >
                    <PlusOutlined /> {t("sources:sourceCreateCTAButton")}
                </AletheiaButton>
            </p>
            <p>{t("personalityCTA:footer")}</p>
        </Row>
    );

    return (
        <BaseList
            apiCall={SourceApi.get}
            filter={{ nameSpace }}
            title={t("sources:sourceListHeader")}
            renderItem={(source, index) =>
                source && <SourceListItem key={index} source={source} />
            }
            grid={{
                gutter: 20,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
            }}
            skeleton={<SourceSkeleton />}
            emptyFallback={SourceCreateCTAButton}
            footer={footer && SourceCreateCTAButton}
        />
    );
};
export default SourceList;
