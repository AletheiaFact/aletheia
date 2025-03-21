/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import colors from "../../styles/colors";
import { Trans, useTranslation } from "next-i18next";
import Subtitle from "../Subtitle";
import Paragraph from "../Paragraph";
import styled from "styled-components";

const CenteredSubtitle = styled(Subtitle)`
    text-align: center;
`;

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <Grid container
            style={{
                color: colors.primary,
                justifyContent: "center",
                width: "100%",
                fontSize: "1rem",
                letterSpacing: "1px",
                fontWeight: 600,
                padding: "20px",
                textAlign: "justify",
            }}
        >
            <Typography variant="h1" sx={{ fontSize: 40, textAlign: "center", fontWeight: "bold" }}>{t("privacyPolicy:title")}</Typography>
            <Paragraph>{t("privacyPolicy:leadParagraph")}</Paragraph>
            <ul>
                <li key={1}>{t("privacyPolicy:tableOfContentsItem1")}</li>
                <li key={2}>{t("privacyPolicy:tableOfContentsItem2")}</li>
                <li key={3}>{t("privacyPolicy:tableOfContentsItem3")}</li>
                <li key={4}>{t("privacyPolicy:tableOfContentsItem4")}</li>
                <li key={5}>{t("privacyPolicy:tableOfContentsItem5")}</li>
                <li key={6}>{t("privacyPolicy:tableOfContentsItem6")}</li>
                <li key={7}>{t("privacyPolicy:tableOfContentsItem7")}</li>
                <li key={8}>{t("privacyPolicy:tableOfContentsItem8")}</li>
                <li key={9}>{t("privacyPolicy:tableOfContentsItem9")}</li>
                <li key={0}>{t("privacyPolicy:tableOfContentsItem10")}</li>
            </ul>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem1")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item1")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem2")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item2")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem3")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item3")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem4")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item4")}</Paragraph>
            <Subtitle>{t("privacyPolicy:subTitleItem5")}</Subtitle>
            <Paragraph>{t("privacyPolicy:item5")}</Paragraph>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{t("privacyPolicy:trackingToolsPanelRecaptchaHeader")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Trans
                        i18nKey={
                            "privacyPolicy:trackingToolsPanelReCaptchaContent"
                        }
                        components={[
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://policies.google.com/privacy?hl=en"
                                target="_blank"
                                rel="noreferrer"
                            ></a>,
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://policies.google.com/terms?hl=en"
                                target="_blank"
                                rel="noreferrer"
                            ></a>,
                        ]}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{t("privacyPolicy:trackingToolsPanelSessionCookiesHeader")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Trans
                        i18nKey={"privacyPolicy:trackingToolsPanelSessionCookiesContent"}
                    />
                </AccordionDetails>
            </Accordion>


            <Accordion sx={{ marginBottom: "20px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{t("privacyPolicy:trackingToolsPanelUmamiHeader")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Trans
                        i18nKey={"privacyPolicy:trackingToolsPanelUmamiContent"}
                        components={[
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://umami.is/"
                                target="_blank"
                                rel="noreferrer"
                            ></a>,
                            <h3 style={{ marginTop: "10px" }}></h3>,
                            <h3 style={{ marginTop: "10px" }}></h3>,
                        ]}
                    />
                </AccordionDetails>
            </Accordion>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem6")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item6")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem7")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item7")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem8")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item8")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem9")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item9")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleItem10")}</CenteredSubtitle>
            <Paragraph>{t("privacyPolicy:item10")}</Paragraph>
            <CenteredSubtitle>{t("privacyPolicy:subTitleContact")}</CenteredSubtitle>
            <Trans
                i18nKey={"privacyPolicy:contact"}
                values={{ email: t("common:contactEmail") }}
                components={[
                    <a
                        style={{ whiteSpace: "pre-wrap", display: "block", textAlign: "center" }}
                        href={`mailto:${t("common:contactEmail")}`}
                        target="_blank"
                        rel="noreferrer"
                    ></a>,
                ]}
            />
        </Grid >
    );
};

export default PrivacyPolicy;
