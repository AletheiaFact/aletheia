import React, { useMemo } from "react";
import { Col } from "antd";
import CardBase from "../CardBase";
import ClassificationText from "../ClassificationText";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";
import SourceListItemStyled from "./SourceListItem.style";

const DOMAIN_PROTOCOL_REGEX = /^(https?:\/\/)?(www\.)?/;

const SourceListItem = ({ source }) => {
    const { t } = useTranslation();

    const title = useMemo(() => {
        const domainWithoutProtocol = source.href.replace(
            DOMAIN_PROTOCOL_REGEX,
            ""
        );
        const domainParts = domainWithoutProtocol.split(".");
        return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    }, [source.href]);

    return (
        <CardBase style={{ padding: "32px" }}>
            <SourceListItemStyled
                span={24}
                classification={source.props.classification}
            >
                <h4 className="title">{title}</h4>

                <span className="summary">{source.props.summary}</span>

                <Col className="footer">
                    <span>
                        {t("sources:sourceReview")}
                        <ClassificationText
                            classification={source.props.classification}
                        />
                    </span>
                    <AletheiaButton
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ width: "fit-content" }}
                    >
                        {t("sources:sourceCardButton")}
                    </AletheiaButton>
                </Col>
            </SourceListItemStyled>
        </CardBase>
    );
};

export default SourceListItem;
