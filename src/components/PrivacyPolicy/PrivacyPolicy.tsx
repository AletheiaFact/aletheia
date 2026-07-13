/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import colors from "../../styles/colors";
import Paragraph from "../Paragraph";
import styled from "styled-components";
import { useTranslations } from "next-intl";

const PrivacyPolicyStyle = styled(Grid)`
    color: ${colors.primary};
    justify-content: "center";
    width: 100%;
    font-size: 1rem;
    letter-Spacing: "1px";
    font-weight: 600;
    padding: 20px;
    text-align: "justify";

    .subtitle-privacyPolicy{
        font-size: 25px;
        margin: 20px 0;
        font-Family: serif; 
        font-Weight: 600;
    }
`;

const PrivacyPolicy = () => {
    const tPrivacyPolicy = useTranslations("privacyPolicy");
    const tCommon = useTranslations("common");
    const contactEmail = tCommon("contactEmail");

    return (
        <PrivacyPolicyStyle item>
            <Typography variant="h1" sx={{ fontSize: 40, textAlign: "center", fontFamily: "initial", fontWeight: 600, padding: "10px 0" }}>
                {tPrivacyPolicy("title")}
            </Typography>
            <Paragraph>{tPrivacyPolicy("leadParagraph")}</Paragraph>
            <ul>
                <li key={1}>{tPrivacyPolicy("tableOfContentsItem1")}</li>
                <li key={2}>{tPrivacyPolicy("tableOfContentsItem2")}</li>
                <li key={3}>{tPrivacyPolicy("tableOfContentsItem3")}</li>
                <li key={4}>{tPrivacyPolicy("tableOfContentsItem4")}</li>
                <li key={5}>{tPrivacyPolicy("tableOfContentsItem5")}</li>
                <li key={6}>{tPrivacyPolicy("tableOfContentsItem6")}</li>
                <li key={7}>{tPrivacyPolicy("tableOfContentsItem7")}</li>
                <li key={8}>{tPrivacyPolicy("tableOfContentsItem8")}</li>
                <li key={9}>{tPrivacyPolicy("tableOfContentsItem9")}</li>
                <li key={0}>{tPrivacyPolicy("tableOfContentsItem10")}</li>
            </ul>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem1")}</Typography>
            <Paragraph>{tPrivacyPolicy("item1")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem2")}</Typography>
            <Paragraph>{tPrivacyPolicy("item2")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem3")}</Typography>
            <Paragraph>{tPrivacyPolicy("item3")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem4")}</Typography>
            <Paragraph>{tPrivacyPolicy("item4")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem5")}</Typography>
            <Paragraph>{tPrivacyPolicy("item5")}</Paragraph>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{tPrivacyPolicy("trackingToolsPanelRecaptchaHeader")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {tPrivacyPolicy.rich(
                        "trackingToolsPanelReCaptchaContent",
                        {
                            privacyLink: (chunks) => (
                                <a
                                    style={{ whiteSpace: "pre-wrap" }}
                                    href="https://policies.google.com/privacy?hl=en"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {chunks}
                                </a>
                            ),
                            conductLink: (chunks) => (
                                <a
                                    style={{ whiteSpace: "pre-wrap" }}
                                    href="https://policies.google.com/terms?hl=en"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {chunks}
                                </a>
                            ),
                        }
                    )}
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{tPrivacyPolicy("trackingToolsPanelSessionCookiesHeader")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {tPrivacyPolicy("trackingToolsPanelSessionCookiesContent")}
                </AccordionDetails>
            </Accordion>


            <Accordion sx={{ marginBottom: "20px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{tPrivacyPolicy("trackingToolsPanelUmamiHeader")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {tPrivacyPolicy.rich(
                        "trackingToolsPanelUmamiContent",
                        {
                            umami: (chunks) => (
                                <a
                                    style={{ whiteSpace: "pre-wrap" }}
                                    href="https://umami.is/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {chunks}
                                </a>
                            ),
                            title1: (chunks) => (
                                <Typography
                                    variant="h6"
                                    sx={{ mt: 1 }}
                                >
                                    {chunks}
                                </Typography>
                            ),
                            title2: (chunks) => (
                                <Typography
                                    variant="h6"
                                    sx={{ mt: 1 }}
                                >
                                    {chunks}
                                </Typography>
                            ),
                        }
                    )}
                </AccordionDetails>
            </Accordion>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem6")}</Typography>
            <Paragraph>{tPrivacyPolicy("item6")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem7")}</Typography>
            <Paragraph>{tPrivacyPolicy("item7")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem8")}</Typography>
            <Paragraph>{tPrivacyPolicy("item8")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem9")}</Typography>
            <Paragraph>{tPrivacyPolicy("item9")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleItem10")}</Typography>
            <Paragraph>{tPrivacyPolicy("item10")}</Paragraph>
            <Typography variant="h2" className="subtitle-privacyPolicy">{tPrivacyPolicy("subTitleContact")}</Typography>
            {tCommon.rich("contactEmail", {
                email: contactEmail,
                link: (chunks) => (
                    <a
                        style={{
                            whiteSpace: "pre-wrap",
                            display: "block",
                            textAlign: "center",
                        }}
                        href={`mailto:${contactEmail}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {chunks}
                    </a>
                ),
            })}
        </PrivacyPolicyStyle >
    );
};

export default PrivacyPolicy;
