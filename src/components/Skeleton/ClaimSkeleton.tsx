import { Grid } from "../Grid";
import React from "react";
import { Skeleton } from "./Skeleton";
import { spacing, borderRadius, shadows } from "../../styles";

/**
 * ClaimSkeleton - Loading skeleton for ClaimCard
 * Matches the structure of ClaimCard component
 */
const ClaimSkeleton = () => {
    return (
        <div
            style={{
                width: "100%",
                background: "#ffffff",
                border: "1px solid #eeeeee",
                boxShadow: shadows.md,
                borderRadius: borderRadius.lg,
                marginBottom: spacing.sm,
                padding: spacing.md,
            }}
        >
            {/* Header with avatar and name */}
            <Grid
                container
                style={{
                    marginBottom: spacing.md,
                    alignItems: "center",
                    gap: spacing.sm,
                }}
            >
                <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="pulse"
                />
                <div style={{ flex: 1 }}>
                    <Skeleton
                        variant="text"
                        width="40%"
                        height={18}
                        animation="pulse"
                    />
                    <Skeleton
                        variant="text"
                        width="30%"
                        height={14}
                        animation="pulse"
                    />
                </div>
            </Grid>

            {/* Claim title */}
            <Skeleton
                variant="text"
                width="90%"
                height={24}
                animation="pulse"
            />
            <Skeleton
                variant="text"
                width="70%"
                height={24}
                animation="pulse"
            />

            {/* Claim content */}
            <div style={{ marginTop: spacing.md }}>
                <Skeleton variant="text" width="100%" animation="pulse" />
                <Skeleton variant="text" width="100%" animation="pulse" />
                <Skeleton variant="text" width="85%" animation="pulse" />
            </div>

            {/* Footer with classification and button */}
            <Grid
                container
                style={{
                    marginTop: spacing.md,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={100}
                    height={32}
                    animation="pulse"
                />
                <Skeleton
                    variant="rounded"
                    width={80}
                    height={40}
                    animation="pulse"
                />
            </Grid>
        </div>
    );
};

export default ClaimSkeleton;
