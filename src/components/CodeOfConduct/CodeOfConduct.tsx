import { Grid, Typography } from "@mui/material"
import colors from "../../styles/colors";
import Paragraph from "../Paragraph";
import styled from "styled-components";
import { useTranslations } from "next-intl";

const CodeOfConductStyle = styled(Grid)`
    color: ${colors.primary};
    justify-content: "center";
    width: "100%";
    font-size: 1rem;
    letter-Spacing: 1px;
    font-weight: 600;
    padding: 20px;

    .title-conduct{
        font-size: 32px;
        margin: 20px 0;
        font-Family: serif; 
        font-Weight: 600;
    }

    .subtitle-conduct{
        font-size: 25px;
        margin: 20px 0;
        font-Family: serif; 
        font-Weight: 600;
    }
`;

const CodeOfConduct = () => {
    const tCodeOfConduct = useTranslations("codeOfConduct");
    const tClaimReviewForm = useTranslations("claimReviewForm");
    return (
        <CodeOfConductStyle item>
            <Typography style={{ fontSize: 40, textAlign: "center", fontFamily: "initial", fontWeight: 600 }} variant="h1">
                {tCodeOfConduct("title")}
            </Typography>
            <Typography className="title-conduct" variant="h2">
                {tCodeOfConduct("introductionSection")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("introductionSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h2">
                {tCodeOfConduct("principlesSection")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("principlesSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h2">
                {tCodeOfConduct("dutiesSection")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("dutiesSectionFirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h2">
                {tCodeOfConduct("methodologySection")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("methodologySectionFirstParagraph")}
            </Paragraph>
            <ul style={{ width: "100%", marginTop: "15px" }}>
                <li key={1}>{tClaimReviewForm("not-fact")}</li>
                <li key={2}>{tClaimReviewForm("trustworthy")}</li>
                <li key={3}>{tClaimReviewForm("trustworthy-but")}</li>
                <li key={4}>{tClaimReviewForm("arguable")}</li>
                <li key={5}>{tClaimReviewForm("misleading")}</li>
                <li key={6}>{tClaimReviewForm("false")}</li>
                <li key={7}>{tClaimReviewForm("unsustainable")}</li>
                <li key={8}>{tClaimReviewForm("exaggerated")}</li>
                <li key={9}>{tClaimReviewForm("unverifiable")}</li>
            </ul>
            <Paragraph>
                {tCodeOfConduct("methodologySectionSecondParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h2">
                {tCodeOfConduct("expectedBehaviorSection")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("expectedBehaviorSectionFirstParagraph")}
            </Paragraph>
            <Typography className="subtitle-conduct" variant="h3">
                {tCodeOfConduct("expectedBehaviorSubSection1")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("expectedBehaviorSubSection1FirstParagraph")}
            </Paragraph>
            <Typography className="subtitle-conduct" variant="h3">
                {tCodeOfConduct("expectedBehaviorSubSection2")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("expectedBehaviorSubSection2FirstParagraph")}
            </Paragraph>
            <Typography className="title-conduct" variant="h2">
                {tCodeOfConduct("unacceptableBehaviorSection")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct("unacceptableBehaviorSectionFirstParagraph")}
            </Paragraph>
            <Typography className="subtitle-conduct" variant="h3">
                {tCodeOfConduct("unacceptableBehaviorSubSection1")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct(
                    "unacceptableBehaviorSubSection1FirstParagraph"
                )}
            </Paragraph>
            <Typography className="subtitle-conduct" variant="h3">
                {tCodeOfConduct("unacceptableBehaviorSubSection2")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct(
                    "unacceptableBehaviorSubSection2FirstParagraph"
                )}
            </Paragraph>
            <Typography className="subtitle-conduct" variant="h3">
                {tCodeOfConduct("unacceptableBehaviorSubSection3")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct(
                    "unacceptableBehaviorSubSection3FirstParagraph"
                )}
            </Paragraph>
            <Typography className="title-conduct" variant="h2">
                {tCodeOfConduct("responsibilitiesSection")}
            </Typography>
            <Typography className="subtitle-conduct" variant="h3">
                {tCodeOfConduct("responsibilitiesSectionSubSection1")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct(
                    "responsibilitiesSectionSubSection1FirstParagraph"
                )}
            </Paragraph>
            <Typography className="subtitle-conduct" variant="h3">
                {tCodeOfConduct("responsibilitiesSectionSubSection2")}
            </Typography>
            <Paragraph>
                {tCodeOfConduct(
                    "responsibilitiesSectionSubSection2FirstParagraph"
                )}
            </Paragraph>
            <Paragraph>
                {tCodeOfConduct(
                    "responsibilitiesSectionSubSection2SecondParagraph"
                )}
            </Paragraph>
        </CodeOfConductStyle>
    );
};

export default CodeOfConduct;
