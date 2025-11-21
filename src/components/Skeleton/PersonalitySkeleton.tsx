import { Grid } from "../Grid";
import React from "react";
import Skeleton from "./Skeleton";
import { spacing, borderRadius, shadows } from "../../styles";

/**
 * PersonalitySkeleton - Loading skeleton for PersonalityCard
 * Matches the structure of PersonalityCard component
 */
const PersonalitySkeleton = () => {
    return (
        <Grid
            container
            style={{
                width: "100%",
                background: "#ffffff",
                border: "1px solid #eeeeee",
                boxShadow: shadows.md,
                borderRadius: borderRadius.lg,
                marginBottom: spacing.sm,
                padding: spacing.button,
            }}
        >
            {/* Avatar column */}
            <Grid
                item
                xs={2.5}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Skeleton
                    variant="circular"
                    width={43}
                    height={43}
                    animation="pulse"
                />
            </Grid>

            {/* Info column */}
            <Grid item xs={5}>
                {/* Personality name */}
                <Skeleton
                    variant="text"
                    width="70%"
                    height={20}
                    animation="pulse"
                />
                {/* Description */}
                <Skeleton
                    variant="text"
                    width="90%"
                    height={16}
                    animation="pulse"
                />
                {/* Stats line */}
                <Skeleton
                    variant="text"
                    width="60%"
                    height={14}
                    animation="pulse"
                />
            </Grid>

            {/* Button column */}
            <Grid
                item
                xs={4.5}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <Skeleton
                    variant="rounded"
                    width={100}
                    height={40}
                    animation="pulse"
                />
            </Grid>
        </Grid>
    );
};

export default PersonalitySkeleton;
