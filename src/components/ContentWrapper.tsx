import { Layout, Row } from "antd";
import { useRouter } from "next/router";
import styled from "styled-components";

import colors from "../styles/colors";
import { queries } from "../styles/mediaQueries";
import BackButton from "./BackButton";

const { Content } = Layout;

const StyledContent = styled(Content)`
    padding: 0;

    ${({ layout }: { layout: string }) =>
        layout === "mobile" &&
        `
        padding: 0 30%;

        @media ${queries.sm} {
            padding: 0 15px;
        }
    `}
`;

const ContentWrapper = ({ children }) => {
    const router = useRouter();

    // TODO: we can remove this when we have desktop layout for all the pages
    const desktopUnReadyPages = [
        "404-page",
        "about-page",
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
        <StyledContent layout={layout}>
            {layout === "mobile" && (
                <Row
                    style={{
                        padding: "10px 30px",
                        background: colors.white,
                        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
                        margin: "0px",
                    }}
                >
                    <BackButton />
                </Row>
            )}
            {children}
        </StyledContent>
    );
};

export default ContentWrapper;
