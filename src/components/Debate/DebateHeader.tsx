import { Grid, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useLayoutEffect, useState } from "react";

import personalityApi from "../../api/personality";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import PersonalityCard from "../Personality/PersonalityCard";
import { NameSpaceEnum } from "../../types/Namespace";
import { currentNameSpace } from "../../atoms/namespace";
import AletheiaButton, { ButtonType } from "../Button";
import { EditOutlined } from "@mui/icons-material";
import { Roles } from "../../types/enums";

const DebateHeader = ({ claim, title, personalities, userRole }) => {
    const [personalitiesArray, setPersonalitiesArray] = useState(personalities);
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [state] = useAtom(callbackTimerAtom);

    useLayoutEffect(() => {
        if (personalities) {
            Promise.all(
                personalities.map(async (p) => {
                    if (p && p._id) {
                        return personalityApi.getPersonality(
                            p?._id,
                            { nameSpace },
                            t
                        );
                    } else {
                        throw Error;
                    }
                })
            )
                .then((newPersonalitiesArray) => {
                    setPersonalitiesArray(newPersonalitiesArray);
                })
                .catch(() => {});
        }
    }, [state, personalities]);

    const baseHref = `/${
        nameSpace !== NameSpaceEnum.Main ? `${nameSpace}/` : ""
    }`;
    const href = `${baseHref}claim/${claim?.claimId}/debate/edit`;

    const { vw } = useAppSelector((state) => state);
    return (
        <Grid
            container
            className="home-header-container"
            style={{
                paddingTop: "32px",
                backgroundColor: colors.lightNeutral,
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    backgroundColor:
                        nameSpace === NameSpaceEnum.Main
                            ? colors.primary
                            : colors.secondary,
                    color: colors.white,
                    width: vw?.sm ? "100%" : "55%",
                    justifyContent: "space-between",
                    padding: "18px 18px",
                    marginRight: "auto",
                    position: "relative",
                    display: "flex",
                    gap: "2vw",
                }}
            >
                <Typography
                    style={{
                        color: colors.white,
                        margin: 0,
                        fontWeight: 700,
                        fontSize: vw?.sm || vw?.xs ? "25px" : "38px",
                    }}
                >
                    {title}
                </Typography>
            </div>
            {userRole === Roles.Admin && claim?.claimId ? (
                <AletheiaButton
                    type={ButtonType.blue}
                    href={href}
                    style={{
                        margin: 20,
                        marginRight: vw?.lg && vw?.md && vw?.sm ? 0 : 160,
                    }}
                >
                    {t("debates:openEditDebateMode")}{" "}
                    <EditOutlined
                        fontSize="small"
                        style={{ margin: "0 0 5 5" }}
                    />
                </AletheiaButton>
            ) : null}
            <Grid
                container
                style={{
                    justifyContent: "space-evenly",
                }}
            >
                {personalitiesArray
                    ? personalitiesArray.map((p, index) => (
                          <Grid
                              item
                              style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "flex-start",
                                  width: "40%",
                                  padding: "32px 0",
                              }}
                              key={p?._id || index}
                          >
                              <PersonalityCard
                                  personality={p}
                                  header={true}
                                  fullWidth={true}
                                  hoistAvatar={true}
                                  centralizedInfo={true}
                                  style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      textAlign: "center",
                                      width: "100%",
                                      padding: "20px",
                                  }}
                              />
                          </Grid>
                      ))
                    : null}
            </Grid>
        </Grid>
    );
};

export default DebateHeader;
