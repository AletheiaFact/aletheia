import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Typography } from "@mui/material";
import colors from "../styles/colors";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    style={{
                        width: "100%",
                        marginTop: "60px",
                        textAlign: "center",
                        padding: "20px",
                    }}
                >
                    <Typography
                        variant="h5"
                        style={{
                            color: colors.primary,
                            fontWeight: 600,
                            marginBottom: "16px",
                        }}
                    >
                        Something went wrong
                    </Typography>
                    <Typography
                        variant="body1"
                        style={{
                            color: colors.secondary,
                            marginBottom: "24px",
                        }}
                    >
                        An unexpected error occurred. Please try again.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={this.handleReset}
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.white,
                        }}
                    >
                        Try again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
