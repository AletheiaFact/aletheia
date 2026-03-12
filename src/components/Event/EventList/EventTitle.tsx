import { Grid, Typography } from "@mui/material";
import colors from "../../../styles/colors";
import { ReactNode } from "react";
import styled from "styled-components";

const TypographyBox = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-left: 16px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 1.5em;
    border-radius: 10px;
    background: ${colors.primary};
  }
`;

interface EventTitleProps {
    total: number;
    label: ReactNode;
    t: (key: string, options?: { total: number }) => string;
}

const EventTitle = ({ total, label, t }: EventTitleProps) => (
    <TypographyBox container>
        {label}
        <Typography
            variant="body2"
            color={colors.blackSecondary}
            alignContent="flex-end"
        >
            {t("events:totalItems", {
                total: total,
            })}
        </Typography>
    </TypographyBox>
);

export default EventTitle;
