import React from "react";
import { Grid } from "@mui/material";
import CTAFolderStyle from "./CTAFolder.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import localConfig from "../../../../config/localConfig";
import CTAFolderMainColumn from "./CTAFolderMainColumn";
import CTAFolderAchievementsColumn from "./CTAFolderAchievementsColumn";

type CTAFolderProps = {
    isSplit?: Boolean;
};

const CTAFolder = ({ isSplit }: CTAFolderProps) => {
    const [nameSpace] = useAtom(currentNameSpace);

    return (
        localConfig.home.folderRedirectForum && (
            <CTAFolderStyle $nameSpace={nameSpace} $isSplit={isSplit}>
                <Grid container className="ctaFolderContent">
                    <CTAFolderMainColumn isHomeFolder={true} />
                    <CTAFolderAchievementsColumn />
                </Grid>
            </CTAFolderStyle>
        )
    );
};

export default CTAFolder;
