import { Button, Col, Row } from "antd";
import { Toolbar } from "@mui/material";
import React, { useContext } from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminToolBarStyle from "./AdminToolBar.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import colors from "../../styles/colors";
import { ReviewTaskEvents } from "../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";

const ReviewTaskAdminToolBar = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const { machineService, setFormAndEvents } = useContext(
        ReviewTaskMachineContext
    );

    const handleReassignUser = () => {
        machineService.send(ReviewTaskEvents.reAssignUser, {
            type: ReviewTaskEvents.reAssignUser,
            setFormAndEvents,
        });
    };

    return (
        <Row justify="center" style={{ background: colors.lightNeutral }}>
            <Col xs={22} lg={18}>
                <AdminToolBarStyle
                    namespace={nameSpace}
                    position="static"
                    style={{ boxShadow: "none", background: colors.lightNeutral }}
                >
                    <Toolbar className="toolbar">
                        <div className="toolbar-item">
                            <Button onClick={handleReassignUser}>
                                <ManageAccountsIcon />
                            </Button>
                        </div>
                    </Toolbar>
                </AdminToolBarStyle>
            </Col>
        </Row>
    );
};

export default ReviewTaskAdminToolBar;
