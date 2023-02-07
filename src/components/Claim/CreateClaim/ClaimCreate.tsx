import React, { useState } from "react";
import { Form } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import TextArea from "../../TextArea";
import BaseClaimForm from "./BaseClaimForm";

const ClaimCreate = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [content, setContent] = useState("");
    const [_, send] = useAtom(createClaimMachineAtom);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (values) => {
        if (!isLoading) {
            setIsLoading(true);
            const claim = { ...values, content };
            send({
                type: CreateClaimEvents.persist,
                claimData: claim,
                t,
                router,
            });
            setIsLoading(false);
        }
    };

    return (
        <BaseClaimForm
            handleSubmit={handleSubmit}
            disableFutureDates
            isLoading={isLoading}
            disclaimer={t("claimForm:disclaimer")}
            dateExtraText={t("claimForm:dateFieldHelp")}
            content={
                <Form.Item
                    name="content"
                    label={t("claimForm:contentField")}
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: t("claimForm:contentFieldError"),
                        },
                    ]}
                    extra={t("claimForm:contentFieldHelp")}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                        marginBottom: "24px",
                    }}
                >
                    <TextArea
                        rows={4}
                        value={content || ""}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t("claimForm:contentFieldPlaceholder")}
                        data-cy={"testContentClaim"}
                    />
                </Form.Item>
            }
        />
    );
};

export default ClaimCreate;
