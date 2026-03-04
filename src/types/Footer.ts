import { SvgIconComponent } from "@mui/icons-material";

export type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
};

export type FooterSocialLink = {
    href: string;
    Icon: SvgIconComponent;
    label: string;
};

