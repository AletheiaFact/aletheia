import { DeleteFilled } from "@ant-design/icons";
import { Button, Col } from "antd";
import { AppBar, Toolbar } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import DeleteContentModal from "./Modal/DeleteContentModal";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const AdminToolBarStyle = styled(AppBar)`
    .toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 4px 12px;
        padding: 0;
        background-color: ${colors.white};
        min-height: 33px;
        border-bottom: 1px solid ${colors.lightGraySecondary};
        gap: 16px;
    }

    .tooltip {
        height: 33px;
    }

    button {
        font-size: 20px;
        color: ${colors.bluePrimary};
    }
`;

const AdminToolBar = ({ content, apiFunction, target }) => {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const router = useRouter();

    return (
        <Col span={18} style={{ margin: "0 auto" }}>
            <AdminToolBarStyle position="static" style={{ boxShadow: "none" }}>
                <Toolbar className="toolbar">
                    <div
                        style={{
                            width: 26,
                            borderBottom: `1px solid ${colors.bluePrimary}`,
                        }}
                    >
                        <Button
                            style={{
                                padding: "5px",
                                background: "none",
                                border: "none",
                                fontSize: 16,
                                color: colors.bluePrimary,
                            }}
                            onClick={() => setIsDeleteModalVisible(true)}
                        >
                            <DeleteFilled />
                        </Button>
                    </div>
                </Toolbar>
            </AdminToolBarStyle>

            <DeleteContentModal
                visible={isDeleteModalVisible}
                contentTitle={t(`${target}:deleteModalTitle`)}
                contentBody={t(`${target}:deleteModalBody`)}
                isLoading={isLoading}
                handleOk={() => {
                    setIsLoading(true);
                    apiFunction(content.id, t)
                        .then(() => {
                            setIsDeleteModalVisible(false);
                            router.push("/");
                            setIsLoading(false);
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                }}
                handleCancel={() => setIsDeleteModalVisible(false)}
            />
        </Col>
    );
};

export default AdminToolBar;
