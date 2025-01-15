import SectionTitle from "./SectionTitle";
import { Col, List, Row } from "antd";
import React from "react";
import Button, { ButtonType } from "./Button";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { isUserLoggedIn } from "../atoms/currentUser";
import { useAtom } from "jotai";

const GridList = ({
    renderItem,
    loggedInMaxColumns = 3,
    dataSource,
    title,
    href = "",
    dataCy = "",
    seeMoreButtonLabel = "",
    disableSeeMoreButton = false,
    gridLayout = {},
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const overrideGridLayout = isLoggedIn
        ? {
              xl: loggedInMaxColumns,
              xxl: loggedInMaxColumns,
              ...gridLayout,
          }
        : {
              xl: 2,
              xxl: 2,
              ...gridLayout,
          };
    return (
        <>
            <SectionTitle>{title}</SectionTitle>

            <Row
                style={{
                    width: "100%",
                }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={dataSource}
                    style={{ width: "100%" }}
                    grid={{
                        gutter: 10,
                        xs: 1,
                        sm: 1,
                        md: loggedInMaxColumns - 1,
                        lg: 2,
                        ...overrideGridLayout,
                    }}
                    renderItem={(item: any) => {
                        return (
                            <Col
                                style={{
                                    display: "flex",
                                    height: "100%",
                                }}
                            >
                                {renderItem(item)}
                            </Col>
                        );
                    }}
                />
            </Row>

            {!disableSeeMoreButton && (
                <Col
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "48px 0 64px 0",
                    }}
                >
                    <Button href={href} type={ButtonType.blue} data-cy={dataCy}>
                        <span
                            style={{
                                display:"flex",
                                alignItems:"center",
                                gap:"5px",
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "24px",
                            }}
                        >
                            {seeMoreButtonLabel} <ArrowForwardOutlined fontSize="small"/>
                        </span>
                    </Button>
                </Col>
            )}
        </>
    );
};

export default GridList;
