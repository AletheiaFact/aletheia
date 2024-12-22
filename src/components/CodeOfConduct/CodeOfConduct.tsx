import { Grid, Typography } from "@mui/material"
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import Paragraph from "../Paragraph";
import styled from "styled-components";

const CodeOfConductStyle = styled(Grid)`
    color: ${colors.primary};
    justify-content: "center";
    width: "100%";
    font-size: 1rem;
    letter-Spacing: 1px;
    font-weight: 600;
    padding: 20px;

    .title-conduct{
        margin: 20px 0;
        font-Family: serif; 
        font-Weight: 600;
    }
`;

const CodeOfConduct = () => {
    const { t } = useTranslation();
    return (
        <CodeOfConductStyle item>
            <Typography style={{ fontSize:40,textAlign:"center", fontFamily: "initial", fontWeight:600}} variant="h4">
                {t("codeOfConduct:title")}
            </Typography>            
            <Typography className="title-conduct" variant="h4">
                {t("codeOfConduct:introductionSection")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:introductionSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h4">
                {t("codeOfConduct:principlesSection")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:principlesSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h4">
                {t("codeOfConduct:dutiesSection")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:dutiesSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h4">
                {t("codeOfConduct:methodologySection")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:methodologySectionFirstParagraph")}
            </Paragraph>
            <ul style={{ width: "100%", marginTop: "15px" }}>
                <li key={1}>{t("claimReviewForm:not-fact")}</li>
                <li key={2}>{t("claimReviewForm:trustworthy")}</li>
                <li key={3}>{t("claimReviewForm:trustworthy-but")}</li>
                <li key={4}>{t("claimReviewForm:arguable")}</li>
                <li key={5}>{t("claimReviewForm:misleading")}</li>
                <li key={6}>{t("claimReviewForm:false")}</li>
                <li key={7}>{t("claimReviewForm:unsustainable")}</li>
                <li key={8}>{t("claimReviewForm:exaggerated")}</li>
                <li key={9}>{t("claimReviewForm:unverifiable")}</li>
            </ul>
            <Paragraph>
                {t("codeOfConduct:methodologySectionSecondParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h4">
                {t("codeOfConduct:expectedBehaviorSection")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:expectedBehaviorSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h5">
                {t("codeOfConduct:expectedBehaviorSubSection1")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:expectedBehaviorSubSection1FirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h5">
                {t("codeOfConduct:expectedBehaviorSubSection2")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:expectedBehaviorSubSection2FirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h4">
                {t("codeOfConduct:unacceptableBehaviorSection")}
            </Typography>
            <Paragraph>
                {t("codeOfConduct:unacceptableBehaviorSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h5">
                {t("codeOfConduct:unacceptableBehaviorSubSection1")}
            </Typography>
            <Paragraph>
                {t(
                    "codeOfConduct:unacceptableBehaviorSubSection1FirstParagraph"
                )}
            </Paragraph>
            <Typography className="title-conduct" variant="h5">
                {t("codeOfConduct:unacceptableBehaviorSubSection2")}
            </Typography>
            <Paragraph>
                {t(
                    "codeOfConduct:unacceptableBehaviorSubSection2FirstParagraph"
                )}
            </Paragraph>
            <Typography className="title-conduct" variant="h5">
                {t("codeOfConduct:unacceptableBehaviorSubSection3")}
            </Typography>
            <Paragraph>
                {t(
                    "codeOfConduct:unacceptableBehaviorSubSection3FirstParagraph"
                )}
            </Paragraph>
            <Typography className="title-conduct" variant="h4">
                {t("codeOfConduct:responsibilitiesSection")}
            </Typography>
            <Typography className="title-conduct" variant="h5">
                {t("codeOfConduct:responsibilitiesSectionSubSection1")}
            </Typography>
            <Paragraph>
                {t(
                    "codeOfConduct:responsibilitiesSectionSubSection1FirstParagraph"
                )}
            </Paragraph>
            <Typography className="title-conduct" variant="h5">
                {t("codeOfConduct:responsibilitiesSectionSubSection2")}
            </Typography>
            <Paragraph>
                {t(
                    "codeOfConduct:responsibilitiesSectionSubSection2FirstParagraph"
                )}
            </Paragraph>
            <Paragraph>
                {t(
                    "codeOfConduct:responsibilitiesSectionSubSection2SecondParagraph"
                )}
            </Paragraph>
        </CodeOfConductStyle>
    );
};

export default CodeOfConduct;
