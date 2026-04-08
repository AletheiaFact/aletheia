import { Link } from "@mui/material";

const HeaderNavLinks = ({ t, baseHref }) => {
    return (
        <>
            <Link
                href={`${baseHref}/verification-request`}
                className="navLink"
                underline="none"
                data-cy="testVerificationRequestNavLink"
            >
                {t("header:verificationRequestItem")}
            </Link>
            <Link
                href={`${baseHref}/event`}
                className="navLink"
                underline="none"
                data-cy="testEventNavLink"
            >
                {t("header:eventItem")}
            </Link>
        </>
    );
};

export default HeaderNavLinks;
