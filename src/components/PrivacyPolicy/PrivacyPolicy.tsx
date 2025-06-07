/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import colors from "../../styles/colors";
import { Trans, useTranslation } from "next-i18next";
import Paragraph from "../Paragraph";
import styled from "styled-components";

const PrivacyPolicyStyle = styled(Grid)`
    color: ${colors.primary};
    justify-content: "center";
    width: 100%;
    font-size: 1rem;
    letter-spacing: "1px";
    font-weight: 600;
    padding: 20px;
    text-align: "justify";

    .subtitle-privacyPolicy {
        font-size: 25px;
        margin: 20px 0;
        font-family: serif;
        font-weight: 600;
    }
`;

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <PrivacyPolicyStyle item>
            <Typography
                variant="h1"
                sx={{
                    fontSize: 40,
                    textAlign: "center",
                    fontFamily: "initial",
                    fontWeight: 600,
                    padding: "10px 0",
                }}
            >
                {t("privacyPolicy:title")}
            </Typography>
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
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem1")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item1")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem2")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item2")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem3")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item3")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem4")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item4")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem5")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item5")}</Paragraph>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        {t("privacyPolicy:trackingToolsPanelRecaptchaHeader")}
                    </Typography>
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
                    <Typography>
                        {t(
                            "privacyPolicy:trackingToolsPanelSessionCookiesHeader"
                        )}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Trans
                        i18nKey={
                            "privacyPolicy:trackingToolsPanelSessionCookiesContent"
                        }
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ marginBottom: "20px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        {t("privacyPolicy:trackingToolsPanelUmamiHeader")}
                    </Typography>
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
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem6")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item6")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem7")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item7")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem8")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item8")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem9")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item9")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleItem10")}
            </Typography>
            <Paragraph>{t("privacyPolicy:item10")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">
                {t("privacyPolicy:subTitleContact")}
            </Typography>
            <Trans
                i18nKey={"privacyPolicy:contact"}
                values={{ email: t("common:contactEmail") }}
                components={[
                    <a
                        style={{
                            whiteSpace: "pre-wrap",
                            display: "block",
                            textAlign: "center",
                        }}
                        href={`mailto:${t("common:contactEmail")}`}
                        target="_blank"
                        rel="noreferrer"
                    ></a>,
                ]}
            />
        </PrivacyPolicyStyle>
    );
};

export default PrivacyPolicy;
