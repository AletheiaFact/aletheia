import { DeleteFilled } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { Toolbar } from "@mui/material";
import React, { useState } from "react";
import HideContentButton from "../HideContentButton";
import HideContentModal from "../Modal/HideContentModal";
import DeleteContentModal from "../Modal/DeleteContentModal";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import UnhideContentModal from "../Modal/UnhideContentModal";
import AletheiaAlert from "../AletheiaAlert";
import AdminToolBarStyle from "./AdminToolBar.style";

const AdminToolBar = ({
    content,
    deleteApiFunction,
    changeHideStatusFunction,
    target,
    descriptionTarget,
    descriptionForHide,
}) => {
    const { t } = useTranslation();

    const [isHideModalVisible, setIsHideModalVisible] = useState(false);
    const [isUnhideModalVisible, setIsUnhideModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [warningDescription, setWarningDescription] =
        useState(descriptionForHide);
    const [hide, setHide] = useState(content?.isHidden);
    const router = useRouter();

    return (
        <Row justify="center">
            <Col sm={22} md={22} lg={18}>
                <AdminToolBarStyle
                    position="static"
                    style={{ boxShadow: "none" }}
                >
                    <Toolbar className="toolbar">
                        <div className="toolbar-item">
                            <HideContentButton
                                hide={hide}
                                handleHide={() => setIsUnhideModalVisible(true)}
                                handleUnhide={() => setIsHideModalVisible(true)}
                            />
                        </div>
                        <div className="toolbar-item">
                            <Button
                                onClick={() => setIsDeleteModalVisible(true)}
                            >
                                <DeleteFilled />
                            </Button>
                        </div>
                    </Toolbar>
                </AdminToolBarStyle>

                {hide && (
                    <div style={{ marginTop: 32 }}>
                        <AletheiaAlert
                            type="warning"
                            message={t(`${descriptionTarget}:warningTitle`)}
                            description={warningDescription}
                            showIcon={true}
                        />
                    </div>
                )}
            </Col>

            <HideContentModal
                visible={isHideModalVisible}
                isLoading={isLoading}
                contentTitle={t(`${target}:hideModalTitle`)}
                contentBody={t(`${target}:hideModalBody`)}
                handleOk={async ({ description, recaptcha }) => {
                    try {
                        setIsLoading(true);
                        await changeHideStatusFunction(
                            content?.id,
                            !hide,
                            t,
                            recaptcha,
                            description
                        );
                        setHide(!hide);
                        setIsHideModalVisible(false);
                        setWarningDescription(description);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setIsLoading(false);
                    }
                }}
                handleCancel={() => setIsHideModalVisible(false)}
            />

            <UnhideContentModal
                visible={isUnhideModalVisible}
                isLoading={isLoading}
                contentTitle={t(`${target}:unhideModalTitle`)}
                contentBody={t(`${target}:unhideModalBody`)}
                handleOk={async () => {
                    try {
                        setIsLoading(true);
                        await changeHideStatusFunction(content?.id, !hide, t);
                        setHide(!hide);
                        setIsUnhideModalVisible(false);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setIsLoading(false);
                    }
                }}
                handleCancel={() => {
                    setIsUnhideModalVisible(false);
                }}
            />

            <DeleteContentModal
                visible={isDeleteModalVisible}
                contentTitle={t(`${target}:deleteModalTitle`)}
                contentBody={t(`${target}:deleteModalBody`)}
                isLoading={isLoading}
                handleOk={async () => {
                    try {
                        setIsLoading(true);
                        await deleteApiFunction(content.id, t);
                        setIsDeleteModalVisible(false);
                        router.push("/");
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setIsLoading(false);
                    }
                }}
                handleCancel={() => setIsDeleteModalVisible(false)}
            />
        </Row>
    );
};

export default AdminToolBar;
