import { Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import BackButton from "./BackButton";

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
                    padding: layout === "mobile" ? "0 15px" : "0",
                },
            }}
        >
            {layout === "mobile" && (
                <Grid
                    container
                    item
                    xs={12}
                    sx={{
                        padding: "10px 30px",
                        backgroundColor: "white",
                        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
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
