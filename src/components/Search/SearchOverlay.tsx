import { LeftCircleFilled } from "@ant-design/icons";
import { Col } from "antd";
import React, { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";
import AletheiaButton from "../Button";
import OverlaySearchInput from "./OverlaySearchInput";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { useRouter } from "next/router";

const OverlayCol = styled(Col)`
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
        display: flex;
        align-items: center;
        max-width: 320px;
        padding-left: 15px;

        .ant-input-affix-wrapper {
            height: 32px;
        }

        @media ${queries.xs} {
            display: none;
            max-width: 100vw;
            height: 56px;
        }
    }

    .overlay {
        background-color: ${({ namespace }) =>
            namespace === NameSpaceEnum.Main
                ? colors.bluePrimary
                : colors.blueSecondary};
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
    const [nameSpace] = useAtom(currentNameSpace);
    const router = useRouter();
    const { vw, isOpen } = useAppSelector((state) => {
        return {
            vw: state.vw,
            isOpen: state?.search?.overlayVisible || false,
        };
    });
    const [nameSpaceProp, setNameSpaceProp] = useState(NameSpaceEnum.Main);

    useLayoutEffect(() => {
        setNameSpaceProp(nameSpace);
    }, [nameSpace]);

    return (
        <OverlayCol namespace={nameSpaceProp} xs={1} sm={8} md={10}>
            {!router.pathname.includes("/home-page") && (
                <div
                    className={`input-container ${
                        vw?.xs && isOpen ? "overlay" : ""
                    }`}
                >
                    {vw?.xs && isOpen && (
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
                    {(isOpen || !vw?.xs) && <OverlaySearchInput />}
                </div>
            )}
        </OverlayCol>
    );
};

export default SearchOverlay;
