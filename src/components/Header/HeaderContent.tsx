import React from "react";
import Logo from "./Logo";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { Link } from "@mui/material";
import HeaderNav from "./HeaderNav";
import HeaderActions from "./HeaderActions";
import { HeaderGridStyle } from "./Header.style";

const HeaderContent = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const baseHref = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    return (
        <HeaderGridStyle container>
            <Link href={baseHref} className="headerLogo">
                <Logo />
            </Link>
            <HeaderNav />
            <HeaderActions />
        </HeaderGridStyle>
    );
};

export default HeaderContent;
