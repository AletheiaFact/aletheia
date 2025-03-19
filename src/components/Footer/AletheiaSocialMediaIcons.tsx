import React from "react";
import { SocialIcon } from "react-social-icons";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { Grid } from "@mui/material";

const AletheiaSocialMediaIcons = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <Grid container item xs={12}
            style={{justifyContent:"center"}}>
            <SocialIcon
                url="https://www.instagram.com/aletheiafact"
                bgColor={
                    nameSpace === NameSpaceEnum.Main
                        ? colors.primary
                        : colors.secondary
                }
                target="_blank"
                rel="noreferrer"
                fgColor="white"
            />
            <SocialIcon
                url="https://www.facebook.com/AletheiaFactorg-107521791638412"
                bgColor={
                    nameSpace === NameSpaceEnum.Main
                        ? colors.primary
                        : colors.secondary
                }
                target="_blank"
                rel="noreferrer"
                fgColor="white"
            />
            <SocialIcon
                url="https://www.linkedin.com/company/aletheiafact-org"
                bgColor={
                    nameSpace === NameSpaceEnum.Main
                        ? colors.primary
                        : colors.secondary
                }
                target="_blank"
                rel="noreferrer"
                fgColor="white"
            />
            <SocialIcon
                url="https://github.com/AletheiaFact/aletheia"
                bgColor={
                    nameSpace === NameSpaceEnum.Main
                        ? colors.primary
                        : colors.secondary
                }
                target="_blank"
                rel="noreferrer"
                fgColor="white"
            />
        </Grid>
    )
}

export default AletheiaSocialMediaIcons;
