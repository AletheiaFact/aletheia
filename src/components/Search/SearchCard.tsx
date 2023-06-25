import React from "react";
import AletheiaAvatar from "../AletheiaAvatar";
import SearchResult from "./SearchResult";
import colors from "../../styles/colors";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import SearchDescription from "./SearchDescription";

const SearchCard = ({
    content,
    searchName,
    handleSearchClick,
    title,
    type,
    avatar = true,
}) => {
    const { t } = useTranslation();

    const getParams = (type, c) => {
        if (type === "personality") {
            return { type: type, personalitySlug: c.slug };
        } else if (type === "claim") {
            return {
                type: type,
                personalitySlug: c.personality[0].slug,
                claimSlug: c.slug,
            };
        }
        return {
            type: type,
            personalitySlug: c.personality[0].slug,
            claimSlug: c.claim[0].slug,
            data_hash: c.data_hash,
        };
    };

    return (
        <Row
            style={{
                background: colors.white,
                padding: "0 10%",
                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
                width: "100%",
            }}
            align="middle"
        >
            {content && Array.isArray(content) && content.length > 0 && (
                <Col
                    style={{
                        padding: "10px 0",
                        borderTop: `1px solid ${colors.grayTertiary}`,
                        width: "100%",
                    }}
                >
                    <h1>{title}</h1>
                    {content.map(
                        (c, i) =>
                            c && (
                                <SearchResult
                                    key={i}
                                    handleOnClick={() =>
                                        handleSearchClick(getParams(type, c))
                                    }
                                    avatar={
                                        avatar && (
                                            <AletheiaAvatar
                                                size={30}
                                                src={c.avatar}
                                                alt={t(
                                                    "seo:personalityImageAlt",
                                                    {
                                                        name: c.name,
                                                    }
                                                )}
                                            />
                                        )
                                    }
                                    name={c.name || c.content || c.title}
                                    searchName={searchName}
                                    description={
                                        type === "sentence" ||
                                        type === "claim" ? (
                                            <SearchDescription
                                                personalityName={
                                                    c?.personality[0]?.name
                                                }
                                                claimDate={
                                                    c?.date || c?.claim[0]?.date
                                                }
                                                sentence={c}
                                            />
                                        ) : (
                                            <>{c.description}</>
                                        )
                                    }
                                />
                            )
                    )}
                </Col>
            )}
        </Row>
    );
};

export default SearchCard;
