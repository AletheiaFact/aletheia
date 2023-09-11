import { DeleteFilled } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
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
    hideDescriptions,
}) => {
    const { t } = useTranslation();
    const router = useRouter();

    const [isHideModalVisible, setIsHideModalVisible] = useState(false);
    const [isUnhideModalVisible, setIsUnhideModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [warningDescription, setWarningDescription] = useState(
        hideDescriptions[target]
    );
    const [hide, setHide] = useState(content?.isHidden);

    useEffect(() => {
        return setWarningDescription(hideDescriptions[target]);
    }, [hide, hideDescriptions, target]);

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteApiFunction(content._id, t);
            setIsDeleteModalVisible(false);
            router.push("/");
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnhide = async () => {
        try {
            setIsLoading(true);
            await changeHideStatusFunction(content?._id, !hide, t);
            hideDescriptions[target] = "";
            setHide(!hide);
            setIsUnhideModalVisible(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHide = async ({ description, recaptcha }) => {
        try {
            setIsLoading(true);
            await changeHideStatusFunction(
                content?._id,
                !hide,
                t,
                recaptcha,
                description
            );
            hideDescriptions[target] = description;
            setHide(!hide);
            setIsHideModalVisible(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

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
                            message={t(`${target?.toLowerCase()}:warningTitle`)}
                            description={warningDescription}
                            showIcon={true}
                        />
                    </div>
                )}
            </Col>

            <HideContentModal
                visible={isHideModalVisible}
                isLoading={isLoading}
                contentTitle={t(`${target.toLowerCase()}:hideModalTitle`)}
                contentBody={t(`${target.toLowerCase()}:hideModalBody`)}
                handleOk={(props) => handleHide(props)}
                handleCancel={() => setIsHideModalVisible(false)}
            />

            <UnhideContentModal
                visible={isUnhideModalVisible}
                isLoading={isLoading}
                contentTitle={t(`${target.toLowerCase()}:unhideModalTitle`)}
                contentBody={t(`${target.toLowerCase()}:unhideModalBody`)}
                handleOk={handleUnhide}
                handleCancel={() => {
                    setIsUnhideModalVisible(false);
                }}
            />

            <DeleteContentModal
                visible={isDeleteModalVisible}
                contentTitle={t(`${target.toLowerCase()}:deleteModalTitle`)}
                contentBody={t(`${target.toLowerCase()}:deleteModalBody`)}
                isLoading={isLoading}
                handleOk={handleDelete}
                handleCancel={() => setIsDeleteModalVisible(false)}
            />
        </Row>
    );
};

export default AdminToolBar;
