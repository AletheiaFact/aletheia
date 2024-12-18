import React from "react";
import CTASectionStyle from "./CTASection.style";
import CTASectionButtons from "./CTASectionButtons";
import CTASectionTitle from "./CTASectionTitle";
import { isUserLoggedIn } from "../../../atoms/currentUser";
import { useAtom } from "jotai";

const CTASection = () => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <CTASectionStyle container isloggedin={isLoggedIn.toString()}>
            <CTASectionTitle />
            <CTASectionButtons />
        </CTASectionStyle>
    );
};

export default CTASection;
