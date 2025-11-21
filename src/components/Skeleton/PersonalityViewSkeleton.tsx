/**
 * PersonalityViewSkeleton - Full page loading skeleton for PersonalityView
 * Shows skeletons for:
 * - Large personality card header
 * - Claim list
 * - Metrics sidebar
 * - More personalities section
 */

import { Grid } from "../Grid";
import React from "react";
import Skeleton from "./Skeleton";
import { spacing, borderRadius, shadows } from "../../styles";
import ClaimSkeleton from "./ClaimSkeleton";
import PersonalitySkeleton from "./PersonalitySkeleton";

/**
 * Large Personality Header Skeleton
 */
const PersonalityHeaderSkeleton = () => (
    <div
        style={{
            width: "100%",
            background: "#ffffff",
            border: "1px solid #eeeeee",
            boxShadow: shadows.md,
            borderRadius: borderRadius.lg,
            marginBottom: spacing['3xl'],
            padding: spacing.xl,
        }}
    >
        <Grid container style={{ alignItems: "center", gap: spacing.lg }}>
            {/* Large avatar */}
            <Grid item style={{ display: "flex", justifyContent: "center" }}>
                <Skeleton
                    variant="circular"
                    width={144}
                    height={144}
                    animation="pulse"
                />
            </Grid>

            {/* Info section */}
            <Grid item xs style={{ flex: 1 }}>
                {/* Name */}
                <Skeleton
                    variant="text"
                    width="50%"
                    height={36}
                    animation="pulse"
                />

                {/* Description */}
                <div style={{ marginTop: spacing.sm }}>
                    <Skeleton variant="text" width="80%" animation="pulse" />
                    <Skeleton variant="text" width="70%" animation="pulse" />
                </div>

                {/* Stats */}
                <div style={{ marginTop: spacing.md }}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Skeleton
                                variant="text"
                                width={80}
                                animation="pulse"
                            />
                        </Grid>
                        <Grid item>
                            <Skeleton
                                variant="text"
                                width={80}
                                animation="pulse"
                            />
                        </Grid>
                        <Grid item>
                            <Skeleton
                                variant="text"
                                width={80}
                                animation="pulse"
                            />
                        </Grid>
                    </Grid>
                </div>
            </Grid>

            {/* Review stats circles (right side on desktop) */}
            <Grid item>
                <Grid container spacing={2}>
                    <Grid item>
                        <Skeleton
                            variant="circular"
                            width={80}
                            height={80}
                            animation="pulse"
                        />
                    </Grid>
                    <Grid item>
                        <Skeleton
                            variant="circular"
                            width={80}
                            height={80}
                            animation="pulse"
                        />
                    </Grid>
                    <Grid item>
                        <Skeleton
                            variant="circular"
                            width={80}
                            height={80}
                            animation="pulse"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </div>
);

/**
 * Metrics Overview Skeleton (Sidebar)
 */
const MetricsSkeleton = () => (
    <div
        style={{
            width: "100%",
            background: "#ffffff",
            border: "1px solid #eeeeee",
            boxShadow: shadows.md,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
        }}
    >
        {/* Title */}
        <Skeleton
            variant="text"
            width="60%"
            height={20}
            animation="pulse"
        />

        {/* Metrics items */}
        {[1, 2, 3, 4].map((item) => (
            <div
                key={item}
                style={{
                    marginTop: spacing.md,
                    paddingBottom: spacing.md,
                    borderBottom: item !== 4 ? "1px solid #f5f5f5" : "none",
                }}
            >
                <Skeleton variant="text" width="80%" animation="pulse" />
                <Skeleton variant="text" width="40%" height={24} animation="pulse" />
            </div>
        ))}
    </div>
);

/**
 * Full PersonalityViewSkeleton Component
 */
const PersonalityViewSkeleton: React.FC = () => {
    return (
        <>
            {/* Large personality header */}
            <Grid container justifyContent="center">
                <Grid item sm={11} md={11} lg={9}>
                    <PersonalityHeaderSkeleton />
                </Grid>
            </Grid>

            {/* Main content: Claims list and Metrics */}
            <Grid container justifyContent="center" style={{ marginTop: spacing['3xl'] }}>
                {/* Claims list column */}
                <Grid item sm={11} md={7} lg={6}>
                    {/* Section title */}
                    <div style={{ marginBottom: spacing.lg }}>
                        <Skeleton
                            variant="text"
                            width="30%"
                            height={28}
                            animation="pulse"
                        />
                    </div>

                    {/* Claim cards */}
                    <ClaimSkeleton />
                    <ClaimSkeleton />
                    <ClaimSkeleton />
                </Grid>

                {/* Metrics sidebar */}
                <Grid item sm={11} md={4} lg={3} style={{ width: "100%" }}>
                    <MetricsSkeleton />
                </Grid>
            </Grid>

            {/* More personalities section */}
            <Grid container justifyContent="center" style={{ marginTop: spacing['3xl'] }}>
                <Grid item sm={11} md={11} lg={9}>
                    {/* Section title */}
                    <div style={{ marginBottom: spacing.lg }}>
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={28}
                            animation="pulse"
                        />
                    </div>

                    {/* Personality cards */}
                    <PersonalitySkeleton />
                    <PersonalitySkeleton />
                    <PersonalitySkeleton />
                </Grid>
            </Grid>
        </>
    );
};

export default PersonalityViewSkeleton;
