import React from "react";
import Grid from "@mui/material/Grid"
import SocialMediaShare from "../SocialMediaShare";
import { useTranslation } from "next-i18next";
import SectionTitle from "../SectionTitle";
import PersonalitiesGrid from "./PersonalitiesGrid";
import { useAppSelector } from "../../store/store";
import CTAFolder from "../Home/CTAFolder/CTAFolder";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../../atoms/currentUser";

const MorePersonalities = ({ personalities, href, title }) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <Grid container
            style={{
                width: "100%",
                paddingTop: "32px",
                justifyContent: "center",
            }}
        >
            <Grid item
                xs={11}
                lg={9}
                xl={5}
            >
                <PersonalitiesGrid
                    personalities={personalities}
                    title={title}
                />
            </Grid>

            <Grid item
                xs={11}
                lg={9}
                xl={4}
                style={{ paddingLeft: vw?.lg ? 0 : 20 }}
            >

                {(!isLoggedIn && !vw?.md) && (
                    <SectionTitle>
                        {t("home:sectionTitle2")}
                    </SectionTitle>
                )}

                <Grid container id="create_account">
                    <CTAFolder isSplit={true}/>
                </Grid>

                <SocialMediaShare href={href} />
            </Grid>
        </Grid>
    );
};

export default MorePersonalities;
