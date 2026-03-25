import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Grid } from "@mui/material";
import colors from "../../styles/colors";

const HeaderGridStyle = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  height: 100%;
  max-width: min(95vw, 1580px);
  padding: 0 clamp(8px, 2vw, 24px);
  gap: 0;

  .headerLogo {
    display: flex;
    align-items: center;
    min-width: clamp(70px, 19vw, 240px);
  }

  .headerNav {
    display: flex;
    align-items: center;
  }

  .headerActions {
    display: flex;
    align-items: center;
    min-width: clamp(70px, 19vw, 240px);
  }

  .navLink {
    text-transform: capitalize;
    color: ${colors.white};
    font-size: clamp(13px, 1.1vw, 15px);
    font-weight: 500;
    white-space: nowrap;
    padding: clamp(6px, 0.8vw, 8px) clamp(6px, 0.9vw, 12px);
    border-radius: 6px;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .navLink:hover {
    background-color: ${colors.whiteLow};
  }

  .language-select {
    color: ${colors.white};
    border-radius: 6px;
    transition: all 0.2s ease;

    .MuiOutlinedInput-notchedOutline {
      border: none;
    }

    .MuiSelect-select {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px !important;
    }

    &:hover {
      background-color: ${colors.whiteLow};
      color: ${colors.white};
    }
  }

  .language-value-container {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 18px;
    text-transform: uppercase;
  }

  .language-value-container p {
    font-size: 12px;
    margin-top: 3px;
    font-weight: 600;
  }

  @media ${queries.lg} {
    padding: 0;
  }

  @media ${queries.md} {
    .headerNav {
      display: none;
    }
  }

  @media ${queries.xs} {
    justify-content: space-between;

    .headerActions {
      gap: 8px;
    }
  }
`;

export default HeaderGridStyle;
