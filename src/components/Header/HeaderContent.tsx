import React from "react";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import colors from "../../styles/colors";
import Logo from "./Logo";
import { useAppSelector } from "../../store/store";
import SelectLanguage from "./SelectLanguage";
import AletheiaButton from "../Button";
import { ActionTypes } from "../../store/types";

const HeaderContent = ({ className }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { menuCollapsed } = useAppSelector((state) => {
        return {
            menuCollapsed:
                state?.menuCollapsed !== undefined
                    ? state?.menuCollapsed
                    : true,
        };
    });
    return (
        <Row
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
            <Col span={4}>
                <AletheiaButton
                    data-cy="testOpenSideMenu"
                    onClick={() => {
                        dispatch({
                            type: ActionTypes.TOGGLE_MENU,
                            menuCollapsed: !menuCollapsed,
                        });
                    }}
                >
                    <MenuOutlined
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            fontSize: "16px",
                            color: "white",
                            paddingLeft: "10px",
                            gap: "5px",
                        }}
                    />
                </AletheiaButton>
            </Col>
            <Col lg={{ span: 16 }} md={{ span: 16 }} xs={{ span: 13 }}>
                <a href="/">
                    <Logo color="white" />
                </a>
            </Col>
            <Col
                lg={{ span: 2 }}
                md={{ span: 2 }}
                sm={{ span: 3 }}
                xs={{ span: 3 }}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "10px",
                }}
            >
                <AletheiaButton
                    onClick={() => {
                        const pathname = router.pathname;
                        dispatch({
                            type: ActionTypes.ENABLE_SEARCH_OVERLAY,
                            overlay: {
                                search: true,
                                results: pathname !== "/personality",
                            },
                        });
                    }}
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
            </Col>
            <Col
                lg={{ span: 2 }}
                md={{ span: 2 }}
                sm={{ span: 4 }}
                xs={{ span: 4 }}
            >
                <SelectLanguage
                    dataCy={"LanguageButton"}
                    defaultLanguage="pt"
                />
            </Col>
        </Row>
    );
};

export default HeaderContent;
