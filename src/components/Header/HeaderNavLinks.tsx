import { Link } from "@mui/material";
import { useHeaderData } from "./useHeaderData";
import { useTranslations } from "next-intl";

const HeaderNavLinks = () => {
    const { state } = useHeaderData();
    const { navigationConfig } = state;
    const tHeader = useTranslations("header")

    return (
        <>
            {navigationConfig.main.map((link) => (
                <Link
                    key={link.key}
                    href={link.path}
                    className="navLink"
                    underline="none"
                    data-cy={link.dataCy}
                >
                    {tHeader(`${link.key}Item`)}
                </Link>
            ))}
        </>
    );
};

export default HeaderNavLinks;
