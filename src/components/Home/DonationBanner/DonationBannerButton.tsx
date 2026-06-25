import AletheiaButton from "../../AletheiaButton";
import { trackUmamiEvent } from "../../../lib/umami";

interface DonationBannerButtonProps {
    type: any;
    closeClick: () => void;
    href?: string;
    text: string;
    trackEvent: string;
}

const DonationBannerButton = ({
    type,
    closeClick,
    href,
    text,
    trackEvent,
}: DonationBannerButtonProps) => {
    return (
        <AletheiaButton
            type={type}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
                if (closeClick) closeClick();
                trackUmamiEvent(trackEvent, text);
            }}
            fontWeight={700}
        >
            {text}
        </AletheiaButton>
    );
};

export default DonationBannerButton;
