import { Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import BackButton from "./BackButton";
import { spacing, shadows } from "../styles";

const ContentWrapper = ({ children }) => {
    const router = useRouter();

    // TODO: we can remove this when we have desktop layout for all the pages
    const desktopUnReadyPages = [
        "404-page",
        "access-denied-page",
        "code-of-conduct",
        "privacy-policy",
        "personality-list",
        "personality-create-search",
        "claim-sources-page",
        "history-page",
    ];

    const layout = desktopUnReadyPages.some((page) =>
        router.pathname.includes(page)
    )
        ? "mobile"
        : "desktop";

    return (
        <Box
            sx={{
                padding: layout === "mobile" ? "0 30%" : "0",
                "@media (max-width: 600px)": {
                    padding: layout === "mobile" ? `0 ${spacing.md}` : "0", // 16px standardized
                },
            }}
        >
            {layout === "mobile" && (
                <Grid
                    container
                    item
                    xs={12}
                    sx={{
                        padding: `${spacing.sm} ${spacing.xl}`, // 8px 32px - standardized spacing
                        backgroundColor: "white",
                        boxShadow: shadows.sm,
                        margin: 0,
                    }}
                >
                    <BackButton />
                </Grid>
            )}
            {children}
        </Box>
    );
};

export default ContentWrapper;
