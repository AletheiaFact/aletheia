import React from "react";
import { Form, Row } from "antd";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import Button, { ButtonType } from "../../Button";

const BaseForm = ({
    id,
    onFinish,
    children,
    isLoading,
    disableSubmit,
    onChangeCaptcha,
    router,
    t,
}) => {
    return (
        <Form
            id={id}
            layout="vertical"
            onFinish={onFinish}
            style={{ padding: "32px 0" }}
        >
            {children}

            <Form.Item>
                <AletheiaCaptcha onChange={onChangeCaptcha} />
            </Form.Item>

            <Row
                style={{
                    justifyContent: "space-evenly",
                    marginBottom: "20px",
                }}
            >
                <Button type={ButtonType.white} onClick={() => router.back()}>
                    {t("claimForm:cancelButton")}
                </Button>
                <Button
                    loading={isLoading}
                    type={ButtonType.blue}
                    htmlType="submit"
                    disabled={disableSubmit || isLoading}
                    data-cy={"testSaveButton"}
                >
                    {t("claimForm:saveButton")}
                </Button>
            </Row>
        </Form>
    );
};

export default BaseForm;
