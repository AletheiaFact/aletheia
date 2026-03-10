import styled, { css } from "styled-components";
import colors from "../../../styles/colors";
import { queries } from "../../../styles/mediaQueries";
import { Box } from "@mui/material";
import { NameSpaceEnum } from "../../../types/Namespace";

type CTAFolderProps = {
    $nameSpace: string;
    $isLoggedIn: boolean;
};

const CTAFolderStyle = styled(Box) <CTAFolderProps>`
  background-color: ${({ $nameSpace }) =>
        $nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
  border-radius: 16px;
  padding: 36px;
  margin-bottom: 45px;
  color: ${colors.white};
  box-shadow: 0 12px 40px ${colors.shadow};

  .ctaFolderContent {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 28px;
    align-items: stretch;
  }

  .ctaMainColumn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  .ctaTitle {
    margin: 0 0 14px;
    font-size: 34px;
    line-height: 1.12;
    font-weight: 800;
    color: ${colors.white};
  }

  .ctaBody {
    margin: 0 0 12px;
    font-size: 18px;
    line-height: 1.45;
    color: ${colors.whiteHigh};
    max-width: 800px;
  }

  .ctaFooter {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: ${colors.neutralTertiary};
    max-width: 700px;
  }

  .ctaButtonWrapper {
    display: flex;
    gap: 12px;
    margin-top: 28px;
  }

  .ctaActionButtons {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    padding: 10px 16px;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    border: 1px solid ${colors.primary};
  }

  .ctaSignUpButton {
    font-weight: 700;
    color: ${colors.primary};
    background-color: ${colors.white};

    &:hover {
      background-color: ${colors.whiteHigh};
      border: 1px solid ${colors.whiteHigh};
    }
  }

  .ctaAboutUsButton {
    font-weight: 600;

    ${({ $isLoggedIn }) =>
        $isLoggedIn
            ? css`
            color: ${colors.primary};
            background-color: ${colors.white};
            border: 1px solid ${colors.primary};

            &:hover {
              background-color: ${colors.whiteHigh};
              border: 1px solid ${colors.whiteHigh};
            }
          `
            : css`
            color: ${colors.white};
            background-color: transparent;
            border: 1px solid ${colors.secondary};

            &:hover {
              background-color: ${colors.whiteLow};
              border: 1px solid ${colors.secondary};
            }
          `}
  }

  .ctaAchievementsColumn {
    border-radius: 16px;
    border: 1px solid ${colors.secondary};
    background: ${colors.whiteLow};
    padding: 30px;

    &:hover {
      transform: translateY(-2px);
      background: ${colors.whiteLow};
    }
  }

  .ctaAchievementsTitle {
    margin: 0 0 22px;
    font-size: 18px;
    line-height: 1.2;
    color: ${colors.white};
    font-weight: 700;
  }

  .ctaAchievementsList {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 14px;
  }

  .ctaAchievementsItem {
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr);
    gap: 10px;
    align-items: start;
    color: ${colors.whiteHigh};
    font-size: 18px;
    line-height: 1.45;
  }

  .ctaAchievementsIcon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 2px solid ${colors.active};
    color: ${colors.active};
    font-weight: 900;
  }

  @media ${queries.md} {
    padding: 30px;

    .ctaFolderContent {
      grid-template-columns: 1fr;
    }

    .ctaTitle {
      font-size: 32px;
    }

    .ctaBody {
      font-size: 19px;
    }

    .ctaAchievementsTitle {
      font-size: 26px;
    }
  }

  @media ${queries.xs} {
    padding: 22px;
    margin-bottom: 22px;

    .ctaTitle {
      font-size: 28px;
    }

    .ctaBody {
      font-size: 17px;
    }

    .ctaFooter {
      font-size: 15px;
    }

    .ctaAchievementsList {
      padding: 20px;
    }

    .ctaAchievementsItem {
      font-size: 16px;
    }
  }
`;

export default CTAFolderStyle;
