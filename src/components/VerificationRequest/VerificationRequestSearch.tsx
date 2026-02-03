import React, { useState } from "react";
import InputSearch from "../Form/InputSearch";
import { SearchOutlined } from "@mui/icons-material";
import { useAppSelector } from "../../store/store";
import AletheiaButton, { ButtonType } from "../Button";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { Grid, Typography } from "@mui/material";
import verificationRequestApi from "../../api/verificationRequestApi";
import { useDispatch } from "react-redux";
import VerificationRequestResultList from "./VerificationRequestResultList";
import Loading from "../Loading";

const VerificationRequestSearch = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState("");

    const { verificationRequests } = useAppSelector((state) => ({
        verificationRequests: state?.search?.searchResults || null,
    }));

    const handleInputSearch = async () => {
        if (!isLoading && content.length > 3) {
            setIsLoading(true);
            await verificationRequestApi.get(
                {
                    page: 1,
                    pageSize: 5,
                    filtersUsed: [content],
                },
                dispatch
            );

            setIsLoading(false);
        }
    };

    return (
          <section className="container">
              <Grid item sm={12} md={6} xl={4}>
                    <InputSearch
                        placeholder={t("verificationRequest:searchPlaceholder")}
                        suffix={
                            <AletheiaButton
                                type={ButtonType.white}
                                onClick={handleInputSearch}
                                className="container"
                                disabled={content.length <= 3}
                                loading={isLoading}
                            >
                                <SearchOutlined />
                            </AletheiaButton>
                        }
                        data-cy={"testInputSearchVerificationRequest"}
                        backgroundColor={colors.white}
                        onChange={({ target }) => setContent(target.value)}
                        onKeyDown={({ key }) => {
                            if (key === "Enter") {
                                handleInputSearch();
                            }
                        }}
                    />
              </Grid>
            {verificationRequests && (
                <Grid item>
                    <Typography className="title" variant="h1">
                        {t("verificationRequest:searchResultsTitle")}
                    </Typography>
                    {isLoading && <Loading />}
                    {verificationRequests.length > 0 ? (
                        <VerificationRequestResultList
                            results={verificationRequests}
                        />
                    ) : (
                        <span>{t("verificationRequest:noResultsMessage")}</span>
                    )}
                </Grid>
            )}
          </section>
    );
};

export default VerificationRequestSearch;
