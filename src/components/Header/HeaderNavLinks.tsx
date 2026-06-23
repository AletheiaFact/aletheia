import { Link } from "@mui/material";
import { useHeaderData } from "./useHeaderData";

const HeaderNavLinks = () => {
    const { state, actions } = useHeaderData();
    const { navigationConfig } = state;
    const { t } = actions;

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
                    {t(`header:${link.key}Item`)}
                </Link>
            ))}
        </>
    );
};

export default HeaderNavLinks;
