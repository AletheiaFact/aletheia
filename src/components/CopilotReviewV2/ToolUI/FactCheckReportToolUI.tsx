import React from "react";
import { makeAssistantToolUI } from "@assistant-ui/react";
import styled from "styled-components";
import colors from "../../../styles/colors";

const ToolCardStyled = styled.div`
    margin: 8px 0;
    border: 1px solid ${colors.lightNeutralSecondary};
    border-radius: 12px;
    overflow: hidden;

    .tool-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: ${colors.lightNeutral};
        border-bottom: 1px solid ${colors.lightNeutralSecondary};

        .tool-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgb(37, 99, 235);
            color: ${colors.white};
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
        }

        .tool-name {
            font-size: 13px;
            font-weight: 600;
            color: ${colors.primary};
        }

        .tool-status {
            margin-left: auto;
            font-size: 12px;
            color: ${colors.secondary};
        }
    }

    .tool-body {
        padding: 12px 16px;
        font-size: 13px;
        color: ${colors.blackSecondary};
    }

    .tool-loading {
        display: flex;
        align-items: center;
        gap: 8px;

        .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid ${colors.lightNeutralSecondary};
            border-top-color: rgb(37, 99, 235);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    }

    .tool-error {
        color: ${colors.error};
    }

    .tool-result {
        .result-classification {
            display: inline-flex;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(37, 99, 235, 0.1);
            color: rgb(37, 99, 235);
            margin-bottom: 8px;
        }

        .result-summary {
            margin-top: 8px;
            line-height: 1.5;
        }
    }
`;

const FactCheckReportToolUI = makeAssistantToolUI<
    { sentence: string },
    { classification: string; summary: string; sources: any[] }
>({
    toolName: "get-fact-checking-report",
    render: ({ args, result, status }) => {
        return (
            <ToolCardStyled>
                <div className="tool-header">
                    <div className="tool-icon">FC</div>
                    <span className="tool-name">Fact Check Report</span>
                    <span className="tool-status">
                        {status.type === "running"
                            ? "Analyzing..."
                            : status.type === "complete"
                              ? "Complete"
                              : "Error"}
                    </span>
                </div>
                <div className="tool-body">
                    {status.type === "running" && (
                        <div className="tool-loading">
                            <div className="spinner" />
                            <span>
                                Analyzing: &ldquo;
                                {args?.sentence?.substring(0, 60)}
                                ...&rdquo;
                            </span>
                        </div>
                    )}

                    {status.type === "incomplete" &&
                        status.reason === "error" && (
                            <div className="tool-error">
                                Analysis failed. Please try again.
                            </div>
                        )}

                    {result && (
                        <div className="tool-result">
                            {result.classification && (
                                <div className="result-classification">
                                    {result.classification}
                                </div>
                            )}
                            {result.summary && (
                                <p className="result-summary">
                                    {result.summary}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </ToolCardStyled>
        );
    },
});

export default FactCheckReportToolUI;
