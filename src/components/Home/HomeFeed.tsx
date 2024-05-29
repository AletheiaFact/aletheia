import React, { useEffect, useState } from "react";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import claimRevisionApi from "../../api/claimRevision";
import Loading from "../Loading";
import HomeFeedList from "./HomeFeedList";

const HomeFeed = ({ searchResults }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState(searchResults);

    useEffect(() => {
        const fetchFeedData = async () => {
            setIsLoading(true);

            const promises = searchResults.map((result, i) => {
                const type = ["personality", "claim", "sentence"][i];
                if (type === "claim") {
                    return Promise.all(
                        result.map((claim) =>
                            claimRevisionApi
                                .getClaimRevisionsById(claim._id)
                                .then((claimRevision) => ({
                                    ...claimRevision,
                                    type,
                                }))
                        )
                    );
                }

                return Promise.resolve(
                    result.map((item) => ({ ...item, type }))
                );
            });

            const [personalities = [], claims = [], sentences = []] =
                await Promise.all(promises);
            setResults([...personalities, ...claims, ...sentences]);
            setIsLoading(false);
        };

        fetchFeedData();
    }, [searchResults]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            {results.length > 0 && (
                <Col>
                    <h2>{t("home:homeFeedTitle")}</h2>

                    <Col
                        style={{
                            display: "flex",
                            gap: 16,
                            flexWrap: "wrap",
                            marginBottom: 32,
                        }}
                    >
                        <HomeFeedList results={results} />
                    </Col>
                </Col>
            )}
        </>
    );
};

export default HomeFeed;
