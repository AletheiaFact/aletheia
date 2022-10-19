import { Drawer } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { GlobalStateMachineProvider } from "../../Context/GlobalStateMachineProvider";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";

import ClaimReviewView, { ClaimReviewViewProps } from "./ClaimReviewView";

const ClaimReviewDrawer = (props: ClaimReviewViewProps) => {
    const dispatch = useDispatch();

    const { reviewDrawerCollapsed } = useAppSelector((state) => {
        return {
            reviewDrawerCollapsed:
                state?.reviewDrawerCollapsed !== undefined
                    ? state?.reviewDrawerCollapsed
                    : true,
        };
    });

    return (
        <Drawer
            visible={!reviewDrawerCollapsed}
            onClose={() => dispatch(actions.closeReviewDrawer())}
            width="47rem"
            placement="right"
            bodyStyle={{ padding: 0 }}
            drawerStyle={{
                backgroundColor: colors.lightGray,
            }}
            closable={false}
        >
            <GlobalStateMachineProvider data_hash={props.sentence.data_hash}>
                <ClaimReviewView {...props} />
            </GlobalStateMachineProvider>
        </Drawer>
    );
};

export default ClaimReviewDrawer;
