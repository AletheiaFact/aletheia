import { Box, Grid, Stack, Typography } from "@mui/material";
import colors from "../../../styles/colors";
import styled from "styled-components";
import FilterToggleButtons, { ViewMode } from "../../FilterToggleButtons";
import { FormatQuoteOutlined, ReportProblemOutlined } from "@mui/icons-material";

const TypographyBox = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalCountText = ({ total, t }: { total: number; t: any }) => (
    <Typography variant="body2" color={colors.blackSecondary} data-cy="testTotalCountText">
        {t("events:totalItems", { total: total })}
    </Typography>
);

interface EventTitleProps {
    total: number;
    hasToggle?: boolean;
    viewMode?: ViewMode;
    setViewMode?: (mode: ViewMode) => void;
    t: (key: string, options?: { total: number }) => string;
}

const EventTitle = ({ total = 0, hasToggle = false, viewMode, setViewMode, t }: EventTitleProps) => {

    if (hasToggle) {
        return (
            <TypographyBox container>
                <TotalCountText total={total} t={t} data-cy="testEventGridCount" />
                <Box style={{ display: "flex", backgroundColor: `${colors.lightNeutral}`, padding: "4px", boxShadow: `0px 2px 10px ${colors.shadow} `, borderRadius: "4px" }}>
                    <FilterToggleButtons
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        style={{ border: "none" }}
                        leftOption={
                            <Stack direction="row" alignItems="center" gap={1}>
                                <FormatQuoteOutlined fontSize="small" />
                                {t("events:claimToggleOption")}
                            </Stack>

                        }
                        rightOption={
                            <Stack direction="row" alignItems="center" gap={1}>
                                <ReportProblemOutlined fontSize="small" />
                                {t("events:verificationRequestsStats")}
                            </Stack>
                        }
                    />
                </Box>
            </TypographyBox>
        );
    }

    return (
        <TypographyBox container>
            <Typography variant="h2" fontSize={24}>
                {t("events:eventsList")}
            </Typography>
            <TotalCountText total={total} t={t} data-cy="testEventGridCount" />
        </TypographyBox>
    );
};

export default EventTitle;
