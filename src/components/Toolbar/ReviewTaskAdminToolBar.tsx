import { Grid, IconButton, Toolbar } from "@mui/material";
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
        <Grid container justifyContent="center" style={{ background: colors.lightNeutral }}>
            <Grid item xs={11} lg={9}>
                <AdminToolBarStyle
                    namespace={nameSpace}
                    position="static"
                    style={{ boxShadow: "none", background: colors.lightNeutral }}
                >
                    <Toolbar className="toolbar">
                        <div className="toolbar-item">
                            <IconButton onClick={handleReassignUser}>
                                <ManageAccountsIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AdminToolBarStyle>
            </Grid>
        </Grid>
    );
};

export default ReviewTaskAdminToolBar;
