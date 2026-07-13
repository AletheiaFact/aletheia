import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "../../../store/store";
import claimRevisionApi from "../../../api/claimRevision";
import Loading from "../../Loading";
import HomeFeedList from "./HomeFeedList";
import { useTranslations } from "next-intl";

const HomeFeed = () => {
    const tHome = useTranslations("home");
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState([]);

    const searchResultsData = useAppSelector((state) => state?.search?.searchResults);

    useEffect(() => {
        const fetchFeedData = async () => {
            if (!searchResultsData) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const searchResultsArray = [
                searchResultsData.personalities || [],
                searchResultsData.claims || [],
                searchResultsData.sentences || [],
            ];

            const promises = searchResultsArray.map((result, i) => {
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
    }, [searchResultsData]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            {results.length > 0 && (
                <Grid container
                    style={{
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: "min(95vw, 1580px)",
                        margin: "0 auto",
                    }}
                >
                    <Typography
                        variant="h2"
                        fontSize={24}
                        style={{ marginBottom: 16, width: "100%" }}
                    >
                        {tHome("homeFeedTitle")}
                    </Typography>

                    <HomeFeedList results={results} />
                </Grid>
            )}
        </>
    );
};

export default HomeFeed;
