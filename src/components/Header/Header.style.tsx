import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Box, Grid, Menu } from "@mui/material";
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

  @media ${queries.xs} {
    justify-content: space-between;

    .headerActions {
      gap: 8px;
    }
  }
`;

const StyledMenu = styled(Menu)`
  & .MuiPaper-root {
    border-radius: 8px;
    box-shadow: 0px 4px 20px ${colors.shadow};
    width: 280px;
  }

  .section-header {
    font-size: 0.7rem;
    font-weight: 600;
    color: ${colors.secondary};
    letter-spacing: 0.05em;
    padding: 12px 16px 6px;
    text-transform: uppercase;
    pointer-events: none;
  }

  .menu-item-container {
    display: flex;
    width: 100%;
    padding: 0px 8px;
    cursor: pointer;
  }

  .menu-item-container:hover {
    background-color: ${colors.lightNeutral};
  }

  .menu-item-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 12px;
    gap: 12px;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background-color: ${colors.lightNeutral};
    border-radius: 8px;
    color: ${colors.secondary};
    flex-shrink: 0;

    svg {
      font-size: 16px;
    }
  }

  .text-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .item-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.black};
    line-height: 1.2;
  }

  .item-subtitle {
    font-size: 0.75rem;
    color: ${colors.secondary};
    line-height: 1.3;
    white-space: normal;
  }

  .menu-divider {
    margin: 8px 0;
    border-color: ${colors.lightTertiary};
  }
`;

const BoxMenuHeader = styled(Box)`
  .menu-header {
    display: flex;
    width: 100%;
    padding: 12px 16px 6px;
    align-items: center;
    gap: 8px;
  }

  .menu-header-avatar {
    background: ${colors.quartiary};
    margin: 0px;
    border: 2px solid ${({ $isSidebar }) => ($isSidebar ? colors.neutral : colors.lightNeutral)};
  }

  .menu-header-info {
    width: 100%;
    margin: 0;
  }

  .menu-header-info.name {
    color: ${({ $isSidebar }) => ($isSidebar ? colors.white : colors.black)};
    font-weight: 600;
  }

  .menu-header-info.title-namespace {
    color: ${({ $isSidebar }) => ($isSidebar ? colors.lightSecondary : colors.black)};
  }

  .menu-header-info.email {
    font-size: 12px;
    color: ${({ $isSidebar }) => ($isSidebar ? colors.neutralTertiary : colors.neutral)};
  }

  .menu-header-info.namespace{
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .select-namespace {
    display: flex;
    justify-content: flex-end;
    color: ${colors.lightSecondary};
    cursor: pointer;
  }

  .select-namespace:hover{
    text-decoration: underline;
  }
`;

export { HeaderGridStyle, StyledMenu, BoxMenuHeader };
