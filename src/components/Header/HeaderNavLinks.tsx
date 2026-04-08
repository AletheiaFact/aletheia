import { Link } from "@mui/material";

const HeaderNavLinks = ({ t, baseHref }) => {
    return (
        <>
            <Link
                href={`${baseHref}/personality`}
                className="navLink"
                underline="none"
                data-cy="testPersonalityNavLink"
            >
                {t("menu:personalityItem")}
            </Link>
            <Link
                href={`${baseHref}/claim`}
                className="navLink"
                underline="none"
                data-cy="testClaimNavLink"
            >
                {t("menu:claimItem")}
            </Link>
            <Link
                href={`${baseHref}/verification-request`}
                className="navLink"
                underline="none"
                data-cy="testVerificationRequestNavLink"
            >
                {t("menu:verificationRequestItem")}
            </Link>
        </>
    );
};

export default HeaderNavLinks;
