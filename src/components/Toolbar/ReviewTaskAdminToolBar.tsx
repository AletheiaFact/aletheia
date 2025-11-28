import { Grid, IconButton, Toolbar } from "@mui/material";
import React, { useContext } from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdminToolBarStyle from "./AdminToolBar.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import colors from "../../styles/colors";
import { ReviewTaskEvents } from "../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import HistoryIcon from '@mui/icons-material/History';
import { useRouter } from "next/router";
import { generateReviewContentPath } from "../../utils/GetReviewContentHref";
import { useAppSelector } from "../../store/store";
import { ContentModelEnum } from "../../types/enums";

const ReviewTaskAdminToolBar = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const { machineService, setFormAndEvents } = useContext(
        ReviewTaskMachineContext
    );
    const router = useRouter();

    const {
        personality,
        claim,
        content,
        data_hash,
    } = useAppSelector((state) => ({
        personality: state.selectedPersonality,
        claim: state.selectedTarget,
        content: state.selectedContent,
        data_hash: state.selectedDataHash,
    }));

    const historyPath = () => {
        const historyRoute = generateReviewContentPath(
            nameSpace,
            personality,
            claim,
            ContentModelEnum.History,
            data_hash,
            content?.reviewTaskType,
        );
        router.push(historyRoute)
    }

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
                            <IconButton
                                sx={{ color: colors.primary }}
                                aria-label="history"
                                onClick={historyPath}
                            >
                                <HistoryIcon />
                            </IconButton>
                        </div>
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
