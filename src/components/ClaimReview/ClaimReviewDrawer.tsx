import { BackwardFilled } from "@ant-design/icons";
import { Col, Drawer, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import { GlobalStateMachineProvider } from "../../Context/GlobalStateMachineProvider";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";

import ClaimReviewView, { ClaimReviewViewProps } from "./ClaimReviewView";

const ClaimReviewDrawer = (props: ClaimReviewViewProps) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { reviewDrawerCollapsed } = useAppSelector((state) => {
        return {
            reviewDrawerCollapsed:
                state?.reviewDrawerCollapsed !== undefined
                    ? state?.reviewDrawerCollapsed
                    : true,
        };
    });

    const generateHref = () =>
        `/personality/${props.personality.slug}/claim/${props.claim.slug}/sentence/${props.sentence.data_hash}`;

    return (
        <Drawer
            visible={!reviewDrawerCollapsed}
            onClose={() => dispatch(actions.closeReviewDrawer())}
            width="47vw"
            placement="right"
            bodyStyle={{ padding: 0 }}
            drawerStyle={{
                backgroundColor: colors.lightGray,
            }}
            closable={false}
        >
            <GlobalStateMachineProvider data_hash={props.sentence.data_hash}>
                <Row
                    justify="space-between"
                    style={{ width: "55%", padding: "1rem" }}
                >
                    <Col>
                        <AletheiaButton
                            icon={<BackwardFilled />}
                            onClick={() =>
                                dispatch(actions.closeReviewDrawer())
                            }
                            type={ButtonType.gray}
                        />
                    </Col>
                    <Col>
                        <AletheiaButton
                            href={generateHref()}
                            type={ButtonType.gray}
                            style={{
                                textDecoration: "underline",
                                fontWeight: "bold",
                            }}
                        >
                            {t("claimReviewTask:seeFullPage")}
                        </AletheiaButton>
                    </Col>
                </Row>
                <ClaimReviewView {...props} />
            </GlobalStateMachineProvider>
        </Drawer>
    );
};

export default ClaimReviewDrawer;
