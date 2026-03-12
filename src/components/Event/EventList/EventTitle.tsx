import { Grid, Typography } from "@mui/material";
import colors from "../../../styles/colors";
import { ReactNode } from "react";
import styled from "styled-components";

const TypographyBox = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface EventTitleProps {
    total?: number;
    label: ReactNode;
    t: (key: string, options?: { total: number }) => string;
}

const EventTitle = ({ total = 0, label, t }: EventTitleProps) => (
    <TypographyBox container>
        {label}

        <Typography variant="body2" color={colors.blackSecondary}>
            {t("events:totalItems", {
                total: total,
            })}
        </Typography>
    </TypographyBox>
);

export default EventTitle;
