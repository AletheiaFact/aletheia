import { SvgIconComponent } from "@mui/icons-material";

export type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
    dataCy?: string;
};

export type FooterSocialLink = {
    href: string;
    Icon: SvgIconComponent;
    label: string;
    dataCy?: string;
};
