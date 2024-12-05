import Button from "../../Button";
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
        <Button
            type={type}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
                if (closeClick) closeClick();
                trackUmamiEvent(trackEvent, text);
            }}
            className="banner-button"
        >
            {text}
        </Button>
    );
};

export default DonationBannerButton;
