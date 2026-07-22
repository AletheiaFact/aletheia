import { Grid } from "@mui/material";
import React from "react";

import api from "../../api/personality";
import BaseList from "../List/BaseList";
import Seo from "../Seo";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import PersonalityCard from "./PersonalityCard";
import PersonalityCreateCTA from "./PersonalityCreateCTA";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import { useLocale, useTranslations } from "next-intl";

const PersonalityList = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const locale = useLocale();
    const tSeo = useTranslations("seo");
    const createPersonalityCTA = (
        <Grid container
            style={{
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
            }}
        >
            <PersonalityCreateCTA
                href={
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}/personality/search`
                        : "/personality/search"
                }
            />
        </Grid>
    );
    return (
        <>
            <Seo
                title={tSeo("personalityListTitle")}
                description={tSeo("personalityListDescription")}
            />
            <BaseList
                apiCall={api.getPersonalities}
                filter={{
                    locale,
                    nameSpace,
                }}
                style={{ paddingTop: 10 }}
                emptyFallback={createPersonalityCTA}
                renderItem={(p) =>
                    p && (
                        <PersonalityCard
                            personality={p}
                            summarized={true}
                            key={p._id}
                        />
                    )
                }
                footer={createPersonalityCTA}
                skeleton={<PersonalitySkeleton />}
            />
        </>
    );
};
export default PersonalityList;
