import React from "react";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { Stats } from "./Stats";
import { Grid } from "@mui/material";
import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const StatsGrid = styled(Grid)`
  display: flex;
  color: ${colors.white};
  justify-content: space-between;
  padding: 50px 0px;

  .statsContainer {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .statsNumber {
    font-size: 40px;
    color: ${colors.lightSecondary};
  }

  .statsTitle {
    font-size: 20px;
    margin-top: 5px;
  }

  @media ${queries.sm} {
    padding: 30px 0px;

    .statsNumber {
      font-size: 36px;
    }

    .statsTitle {
      font-size: 16px;
    }
  }

  @media ${queries.xs} {
    justify-content: space-around;
    padding: 20px 0px;

    .statsContainer {
      gap: 12px;
    }

    .statsNumber {
      font-size: 32px;
    }

    .statsTitle {
      font-size: 14px;
    }
  }
`;

const HomeStats = ({ stats }) => {
    const { t } = useTranslation();

    return (
        <StatsGrid container>
            <Stats info={stats.personalities} title={t("home:statsPersonalities")} />
            <Stats info={stats.claims} title={t("home:statsClaims")} />
            <Stats info={stats.reviews} title={t("home:statsClaimReviews")} />
        </StatsGrid>
    );
};

export default HomeStats;
