import React from "react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import colors from "../../../styles/colors";
import reviewColors from "../../../constants/reviewColors";
import { queries } from "../../../styles/mediaQueries";
import { Report } from "../../../types/Report";

interface ReportPreviewSidebarProps {
    editorReport: Report | null;
    classification?: string;
    claim?: any;
    content?: any;
    personality?: any;
}

const ReportPreviewStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 340px;
    min-width: 340px;
    height: 100%;
    background: ${colors.lightNeutral};
    border-left: 1px solid ${colors.lightNeutralSecondary};
    overflow-y: auto;

    .preview-header {
        padding: 16px 20px;
        border-bottom: 1px solid ${colors.lightNeutralSecondary};

        h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: ${colors.primary};
        }
    }

    .preview-section {
        padding: 16px 20px;
        border-bottom: 1px solid ${colors.lightNeutralSecondary};

        .section-title {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: ${colors.secondary};
            margin-bottom: 8px;
        }
    }

    .claim-highlight {
        background: ${colors.white};
        border-left: 3px solid ${colors.lightPrimary};
        padding: 12px;
        border-radius: 0 6px 6px 0;
        font-size: 13px;
        line-height: 1.5;
        color: ${colors.black};
        font-style: italic;

        .claim-speaker {
            font-size: 11px;
            font-weight: 600;
            color: ${colors.secondary};
            margin-bottom: 4px;
            font-style: normal;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
    }

    .classification-badge {
        display: inline-flex;
        align-items: center;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .sources-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            padding: 8px 0;
            border-bottom: 1px solid ${colors.lightNeutralSecondary};
            font-size: 13px;
            color: ${colors.blackSecondary};

            &:last-child {
                border-bottom: none;
            }

            a {
                color: rgb(37, 99, 235);
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        color: ${colors.secondary};
        font-size: 13px;
    }

    @media ${queries.sm} {
        width: 100%;
        min-width: unset;
        max-height: 40vh;
    }
`;

const ReportPreviewSidebar = ({
    editorReport,
    classification,
    claim,
    content,
    personality,
}: ReportPreviewSidebarProps) => {
    const { t } = useTranslation();

    const report = editorReport as any;
    const sources = report?.sources || [];
    const verdict = classification || report?.classification;
    const sentence = content?.content;
    const classificationColor = verdict ? reviewColors[verdict] : undefined;

    return (
        <ReportPreviewStyled data-cy="copilotV2ReportPreview">
            <div className="preview-header">
                <h3>{t("copilotChatBot:reportPreview")}</h3>
            </div>

            {sentence && (
                <div className="preview-section">
                    <div className="section-title">
                        {t("copilotChatBot:claimUnderReview")}
                    </div>
                    <div className="claim-highlight">
                        {personality?.name && (
                            <div className="claim-speaker">
                                {personality.name}
                            </div>
                        )}
                        {`"(...) ${sentence}"`}
                    </div>
                </div>
            )}

            {verdict && (
                <div className="preview-section">
                    <div className="section-title">
                        {t("copilotChatBot:classification")}
                    </div>
                    <div
                        className="classification-badge"
                        style={{
                            color: classificationColor || colors.primary,
                            background: classificationColor
                                ? `${classificationColor}15`
                                : colors.lightNeutralSecondary,
                            border: `1px solid ${
                                classificationColor ||
                                colors.lightNeutralSecondary
                            }`,
                        }}
                    >
                        {t(`claimReviewForm:${verdict}`)}
                    </div>
                </div>
            )}

            {sources.length > 0 && (
                <div className="preview-section">
                    <div className="section-title">
                        {t("copilotChatBot:sources")}
                    </div>
                    <ul className="sources-list">
                        {sources.map((source: any, index: number) => (
                            <li key={index}>
                                {source.href ? (
                                    <a
                                        href={source.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {source.title || source.href}
                                    </a>
                                ) : (
                                    source.title || source
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!sentence && !verdict && sources.length === 0 && (
                <div className="empty-state">
                    <p>{t("copilotChatBot:noReportYet")}</p>
                </div>
            )}
        </ReportPreviewStyled>
    );
};

export default ReportPreviewSidebar;
