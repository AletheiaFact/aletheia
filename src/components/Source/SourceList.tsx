import React from "react";
import SourceApi from "../../api/sourceApi";
import BaseList from "../List/BaseList";
import SourceSkeleton from "../Skeleton/SourceSkeleton";
import SourceListItem from "./SourceListItem";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import SourceCreateCTA from "./SourceCreateCTA";

const SourceList = ({ footer = false }) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    return (
        <Grid container item xs={11} lg={10} justifySelf="center">
            <BaseList
                apiCall={SourceApi.get}
                filter={{ nameSpace }}
                title={t("sources:sourceListHeader")}
                renderItem={(source, index) =>
                    source && <SourceListItem key={index} source={source} />
                }
                style={{ alignItems: "flex-start" }}
                showDividers={false}
                grid={{
                    xs: 12,
                    lg: 6
                }}
                skeleton={<SourceSkeleton />}
                emptyFallback={<SourceCreateCTA />}
                footer={footer && <SourceCreateCTA />}
            />
        </Grid>
    );
};
export default SourceList;
