import { LeftCircleFilled } from "@ant-design/icons";
import { Col } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";
import AletheiaButton from "../Button";
import OverlaySearchInput from "./OverlaySearchInput";

const OverlayCol = styled(Col)`
    .ant-input-search.ant-input-affix-wrapper-lg {
        padding: 9px 14px;
    }

    .ant-input-lg {
        font-weight: 600;
    }

    .ant-input::placeholder {
        font-style: italic;
        font-weight: 300;
        font-size: 14px;
        line-height: 20px;
        color: ${colors.blackSecondary};
    }

    .input-container {
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        max-width: 320px;
        padding-left: 15px;
        @media ${queries.sm} {
            display: none;
            max-width: 100vw;
        }
    }

    .overlay {
        background-color: ${colors.bluePrimary};
        position: fixed;
        z-index: 3;
        width: 100vw;
        left: 0;
        top: 0;
        display: flex;
        padding-right: 15px;
    }
`;

const SearchOverlay = () => {
    const dispatch = useDispatch();
    const { vw, isOpen } = useAppSelector((state) => {
        return {
            vw: state.vw,
            isOpen: state?.search?.overlayVisible || false,
        };
    });

    return (
        <OverlayCol sm={1} md={12}>
            <div
                className={`input-container ${
                    vw?.sm && isOpen ? "overlay" : ""
                }`}
            >
                {vw?.sm && isOpen && (
                    <AletheiaButton
                        onClick={() => {
                            dispatch(actions.closeResultsOverlay());
                        }}
                    >
                        <LeftCircleFilled
                            style={{
                                fontSize: "24px",
                            }}
                        />
                    </AletheiaButton>
                )}
                {(isOpen || !vw?.sm) && <OverlaySearchInput />}
            </div>
        </OverlayCol>
    );
};

export default SearchOverlay;
