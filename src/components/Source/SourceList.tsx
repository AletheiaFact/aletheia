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
        <Grid container justifyContent="center">
            <Grid item xs={9} sm={12} lg={10}>
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
                    emptyFallback={<SourceCreateCTA />}
                    footer={footer && <SourceCreateCTA />}
                />
            </Grid>
        </Grid>
    );
};
export default SourceList;
