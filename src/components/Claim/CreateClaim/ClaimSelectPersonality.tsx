import { Card, CardActions, CardContent } from "@mui/material";
import { Col, message, Row } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { stateSelector } from "../../../machines/createClaim/selectors";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import { ContentModelEnum } from "../../../types/enums";
import AletheiaButton from "../../Button";
import PersonalityCreateSearch from "../../Personality/PersonalityCreateSearch";
import PersonalityMinimalCard from "../../Personality/PersonalityMinimalCard";

const ClaimSelectPersonality = () => {
    const [state, send] = useAtom(createClaimMachineAtom);
    const isDebate = stateSelector(state, "setupDebate");
    const { claimData } = state.context;
    const { personalities } = claimData;
    const { t } = useTranslation();
    const canContinueWithoutPersonality =
        claimData.contentModel === ContentModelEnum.Image;

    const disableContinueWithPersonality =
        !claimData.personalities ||
        (isDebate && claimData.personalities.length < 2);

    const selectPersonality = (personality) => {
        send({
            type: CreateClaimEvents.addPersonality,
            claimData: { personalities: [personality] },
        });
    };

    const addPersonality = (personality) => {
        if (claimData.personalities.some((p) => p._id === personality._id)) {
            message.info(t("claimForm:personalityAlreadyAdded"));
            return;
        }
        send({
            type: CreateClaimEvents.addPersonality,
            claimData: {
                personalities: isDebate
                    ? [...claimData.personalities, personality]
                    : [personality],
            },
        });
    };

    const continueWithPersonality = () => {
        if (claimData.personalities) {
            send(CreateClaimEvents.savePersonality);
        }
    };

    const continueWithoutPersonality = () => {
        send({
            type: CreateClaimEvents.noPersonality,
            claimData: { personalities: [] },
        });
    };

    const handleRemovePersonality = (personality) => {
        send({
            type: CreateClaimEvents.removePersonality,
            personality,
        });
    };

    return (
        <>
            <div style={{ marginTop: "24px" }}>
                <h3
                    style={{
                        fontSize: "18px",
                        lineHeight: "24px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    {t("claimForm:selectPersonalityTitle")}
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    {t("claimForm:selectPersonalityText")}
                </p>
            </div>
            <PersonalityCreateSearch
                selectPersonality={
                    isDebate ? addPersonality : selectPersonality
                }
                withSuggestions={true}
            />
            <h3
                style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    color: colors.blackSecondary,
                    marginBottom: "8px",
                }}
            >
                {t("claimForm:selectedPersonalities")}
            </h3>
            <Row>
                {personalities &&
                    personalities.length > 0 &&
                    personalities.map((personality) => (
                        <Col span={12}>
                            <Card variant="elevation" style={{ margin: "8px" }}>
                                <CardContent>
                                    <PersonalityMinimalCard
                                        personality={personality}
                                    />
                                </CardContent>
                                <CardActions style={{ justifyContent: "end" }}>
                                    <AletheiaButton
                                        onClick={() =>
                                            handleRemovePersonality(personality)
                                        }
                                    >
                                        {t("claimForm:remove")}
                                    </AletheiaButton>
                                </CardActions>
                            </Card>
                        </Col>
                    ))}
            </Row>
            <Col
                style={{
                    margin: "24px 0",
                    display: "flex",
                    justifyContent: "space-evenly",
                }}
            >
                <AletheiaButton
                    onClick={continueWithPersonality}
                    disabled={disableContinueWithPersonality}
                    style={{ textTransform: "uppercase" }}
                    data-cy="testSelectPersonality"
                >
                    {t("claimForm:selectPersonalityButton")}
                </AletheiaButton>
                {canContinueWithoutPersonality && (
                    <AletheiaButton
                        onClick={continueWithoutPersonality}
                        style={{ textTransform: "uppercase" }}
                        data-cy="testContinueWithoutPersonality"
                    >
                        {t("claimForm:noPersonalityButton")}
                    </AletheiaButton>
                )}
            </Col>
        </>
    );
};

export default ClaimSelectPersonality;
