import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useAtom } from "jotai";
import { ArrowCircleLeft } from "@mui/icons-material";

import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import OverlaySearchInput from "./OverlaySearchInput";
import { NameSpaceEnum } from "../../types/Namespace";
import { currentNameSpace } from "../../atoms/namespace";
import { queries } from "../../styles/mediaQueries";

const OverlayWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 40vw;
  height: 64px;
  z-index: 1000;
  background-color: ${({ $namespace }) =>
        $namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};

  display: flex;
  align-items: center;
  justify-content: center;

  @media ${queries.xs} {
    width: 98vw;
  }

  .content-container {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 600px;
    gap: 12px;
  }
`;

const SearchOverlay = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);

    const isOpen = useAppSelector(
        (state) => state?.search?.overlayVisible || false
    );
    const isHomePage = router.pathname.includes("/home-page");

    if (!isOpen || isHomePage) {
        return null;
    }

    return (
        <OverlayWrapper $namespace={nameSpace}>
            <div className="content-container">
                <AletheiaButton
                    onClick={() => dispatch(actions.closeResultsOverlay())}
                    style={{ minWidth: "auto", padding: 0 }}
                >
                    {vw?.xs && isOpen && (
                        <AletheiaButton
                            type={ButtonType.primary}
                            onClick={() => {
                                dispatch(actions.closeResultsOverlay());
                            }}
                        >
                            <ArrowCircleLeft
                                style={{
                                    fontSize: "24px",
                                }}
                            />
                        </AletheiaButton>
                    )}
                    {(isOpen || !vw?.xs) && <OverlaySearchInput />}
                </div>
            )}
        </OverlayGrid>
    );
};

export default SearchOverlay;
