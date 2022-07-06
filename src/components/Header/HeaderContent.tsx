import React from "react";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { GB, BR } from 'country-flag-icons/react/3x2'
import colors from "../../styles/colors";
import Logo from "./Logo";
import { useAppSelector } from "../../store/store";
import ButtonFlag from "./ButtonFlag";

const HeaderContent = ({ className }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { menuCollapsed } = useAppSelector(
        (state) => {
            return {
                menuCollapsed: state?.menuCollapsed !== undefined ? state?.menuCollapsed : true,
            }
        }
    );
    return <Row
        className={className}
        style={{
            backgroundColor: colors.bluePrimary,
            boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
            height: "70px",
            padding: "0 15px",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <Col span={2}>
            <a data-cy="testSideMenuClosed"
                onClick={() => {
                    dispatch({
                        type: "TOGGLE_MENU",
                        menuCollapsed: !menuCollapsed
                    });
                }}
            >
                <MenuOutlined
                    style={{
                        fontSize: "16px",
                        color: "white",
                        padding: "8px"
                    }}
                />
            </a>
        </Col>
        <Col span={20}>
            <a onClick={() => router.push("/")}>
                <Logo color="white" />
            </a>
        </Col>
        <Col span={1}>
            <a
                onClick={() => {
                    const pathname = router.pathname;
                    dispatch({
                        type: "ENABLE_SEARCH_OVERLAY",
                        overlay: {
                            search: true,
                            results: pathname !== "/personality"
                        }
                    });
                }}
                data-cy={"testSearchPersonality"}
            >
                <SearchOutlined
                    style={{
                        fontSize: "16px",
                        color: "white",
                        padding: "8px"
                    }}
                />
            </a>
        </Col>
        <Col span={1} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <ButtonFlag dataCy={"PortugueseLanguageButton"} language="pt">
                <BR title="PT" style={{ width: "20px"}} />
            </ButtonFlag>

            <ButtonFlag dataCy={"EnglishLanguageButton"} language="en">
                <GB title="EN" style={{ width: "20px"}} />
            </ButtonFlag>
        </Col>
    </Row>
};

export default styled(HeaderContent)`
    @media (min-width: 768px) {
        .aletheia-header {
            padding: 0 30%;
        }
    }
`;
