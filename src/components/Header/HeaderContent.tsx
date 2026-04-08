import React from "react";
import Logo from "./Logo";
import { Grid, Link } from "@mui/material";
import HeaderActions from "./HeaderActions";
import { HeaderGridStyle } from "./Header.style";
import HeaderNavLinks from "./HeaderNavLinks";
import HeaderInstitutionMenu from "./HeaderInstitutionMenu";
import UserMenu from "./UserMenu";
import { useHeaderData } from "./useHeaderData";
import { useAppSelector } from "../../store/store";
import HeaderRepositoryMenu from "./HeaderRepositoryMenu";

const HeaderContent = () => {
    const { state, actions } = useHeaderData();
    const { baseHref } = state;
    const { t } = actions;
    const { vw } = useAppSelector((state) => state);

    return (
        <HeaderGridStyle container>
            <Link
                href={`${baseHref}/`}
                className="headerLogo">
                <Logo />
            </Link>
            {!vw?.md && (
                <Grid item className="headerNav">
                    <HeaderInstitutionMenu />
                    <HeaderRepositoryMenu />
                    <HeaderNavLinks
                        t={t}
                        baseHref={baseHref}
                    />
                    <UserMenu />
                </Grid>
            )}
            <HeaderActions />
        </HeaderGridStyle>
    );
};

export default HeaderContent;
