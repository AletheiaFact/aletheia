import React from "react";
import { t } from "i18next";
import AletheiaAvatar from "./AletheiaAvatar";
import SearchResult from "./SearchResult";
import colors from "../styles/colors";
import { Col, Row } from "antd";

const SearchCard = ({
    content,
    searchName,
    handleSearchClick,
    title,
    avatar = true,
}) => {
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
                    <h1>{t("search:personalityHeaderTitle")}</h1>
                    {content.map(
                        (c, i) =>
                            c && (
                                <SearchResult
                                    key={i}
                                    handleOnClick={() =>
                                        handleSearchClick(
                                            c.slug || {
                                                claimSlug: c.claim[0].slug,
                                                personalitySlug:
                                                    c.personality[0].slug,
                                                data_hash: c.data_hash,
                                            }
                                        )
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
                                    name={c.name || c.content}
                                    searchName={searchName}
                                />
                            )
                    )}
                </Col>
            )}
        </Row>
    );
};

export default SearchCard;
