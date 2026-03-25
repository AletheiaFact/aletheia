import React, { useLayoutEffect, useState } from "react";
import Logo from "./Logo";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { Link } from "@mui/material";
import HeaderGridStyle from "./Header.style";
import HeaderNav from "./HeaderNav";
import HeaderActions from "./HeaderActions";

const HeaderContent = () => {
    const [nameSpace] = useAtom(currentNameSpace);
    const [href, setHref] = useState("/");

    useLayoutEffect(() => {
        setHref(nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "/");
    }, [nameSpace]);

    return (
        <HeaderGridStyle container>
            <Link href={href} className="headerLogo">
                <Logo />
            </Link>
            <HeaderNav />
            <HeaderActions />
        </HeaderGridStyle>
    );
};

export default HeaderContent;
