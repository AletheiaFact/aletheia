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
import { TargetModel } from "../../types/enums";

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
        hideDescriptions?.[target]
    );
    const [hide, setHide] = useState(content?.isHidden);

    useEffect(() => {
        return setWarningDescription(hideDescriptions?.[target]);
    }, [hide, hideDescriptions, target]);

    const handleDelete = async ({ recaptcha }) => {
        try {
            setIsLoading(true);
            await deleteApiFunction(content._id, recaptcha, t);
            setIsDeleteModalVisible(false);
            router.push("/");
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnhide = async ({ recaptcha }) => {
        try {
            setIsLoading(true);
            await changeHideStatusFunction(content?._id, !hide, t, recaptcha);
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

    const getTargetI18n = () => {
        return target === TargetModel.ClaimReview
            ? target.charAt(0).toLowerCase() + target.slice(1)
            : target?.toLowerCase();
    };

    return (
        <Row justify="center">
            <Col xs={22} lg={18}>
                <AdminToolBarStyle
                    position="static"
                    style={{ boxShadow: "none", background: "transparent" }}
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
                            message={t(`${getTargetI18n()}:warningTitle`)}
                            description={warningDescription}
                            showIcon={true}
                        />
                    </div>
                )}
            </Col>

            <HideContentModal
                visible={isHideModalVisible}
                isLoading={isLoading}
                contentTitle={t(`${getTargetI18n()}:hideModalTitle`)}
                contentBody={t(`${getTargetI18n()}:hideModalBody`)}
                handleOk={(props) => handleHide(props)}
                handleCancel={() => setIsHideModalVisible(false)}
            />

            <UnhideContentModal
                visible={isUnhideModalVisible}
                isLoading={isLoading}
                contentTitle={t(`${getTargetI18n()}:unhideModalTitle`)}
                contentBody={t(`${getTargetI18n()}:unhideModalBody`)}
                handleOk={handleUnhide}
                handleCancel={() => {
                    setIsUnhideModalVisible(false);
                }}
            />

            <DeleteContentModal
                visible={isDeleteModalVisible}
                contentTitle={t(`${getTargetI18n()}:deleteModalTitle`)}
                contentBody={t(`${getTargetI18n()}:deleteModalBody`)}
                isLoading={isLoading}
                handleOk={handleDelete}
                handleCancel={() => setIsDeleteModalVisible(false)}
            />
        </Row>
    );
};

export default AdminToolBar;
