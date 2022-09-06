import { LeftCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Col } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
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

    .overlay {
        position: fixed;
        z-index: 3;
        width: 100vw;
        left: 0;
        top: 0;
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

    const handleClickSearchIcon = () => {
        dispatch(actions.openResultsOverlay());
    };

    return (
        <OverlayCol sm={1} md={12}>
            <div
                style={{
                    display: "flex",
                    height: "70px",
                    padding: "0 15px",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    minWidth: "100px",
                }}
            >
                <div
                    className={vw?.sm && isOpen ? "overlay" : ""}
                    style={{
                        backgroundColor: colors.bluePrimary,
                        width: "100%",
                        height: "70px",
                        display: "flex",
                        alignItems: "center",
                    }}
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
                                    color: "white",
                                    padding: "8px",
                                }}
                            />
                        </AletheiaButton>
                    )}
                    {(isOpen || !vw?.sm) && <OverlaySearchInput />}
                </div>
                {vw?.sm && (
                    <AletheiaButton
                        onClick={handleClickSearchIcon}
                        data-cy={"testSearchPersonality"}
                    >
                        <SearchOutlined
                            style={{
                                fontSize: "16px",
                                color: "white",
                                padding: "8px",
                            }}
                        />
                    </AletheiaButton>
                )}
            </div>
        </OverlayCol>
    );
};

export default SearchOverlay;
