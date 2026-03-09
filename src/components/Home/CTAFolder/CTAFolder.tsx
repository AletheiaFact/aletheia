import React from "react";
import { Grid } from "@mui/material";
import CTAFolderStyle from "./CTAFolder.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import localConfig from "../../../../config/localConfig";
import CTAFolderMainColumn from "./CTAFolderMainColumn";
import CTAFolderAchievementsColumn from "./CTAFolderAchievementsColumn";

const CTAFolder = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        localConfig.home.folderRedirectForum && (
            <CTAFolderStyle
                $nameSpace={nameSpace}
                $isLoggedIn={isLoggedIn}
            >
                <Grid container className="ctaFolderContent">
                    <CTAFolderMainColumn
                        isLoggedIn={isLoggedIn}
                    />
                    <CTAFolderAchievementsColumn />
                </Grid>
            </CTAFolderStyle>
        )
    );
}


export default CTAFolder;
