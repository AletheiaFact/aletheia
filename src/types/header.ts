import { TFunction } from "next-i18next";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { NameSpaceEnum } from "./Namespace";
import { User } from "./User";

export interface BaseNavItem {
    key: string;
    icon?: ReactNode;
    label?: string;
    path?: string;
    action?: () => void;
    dataCy?: string;
}

export interface SidebarItem extends BaseNavItem {
    showIcon?: boolean;
    isDestructive?: boolean;
    isActive?: boolean;
}

export interface MenuItem extends BaseNavItem {
    showIcon?: boolean;
    isDestructive?: boolean;
}

export interface LanguageOption extends BaseNavItem {
    value: string;
    displayAbbreviation: string;
    isActive?: boolean;
}

export interface SidebarSection {
    title: string;
    items: SidebarItem[];
}

export interface MenuSection {
    title: string;
    items: MenuItem[];
}

export interface LanguageSection {
    title: string;
    items: LanguageOption[];
}

export interface UseHeaderDataReturn {
    state: {
        userId: string | null;
        isLoading: boolean;
        anchorEl: HTMLElement | null;
        isOpen: boolean;
        myAccountSections: SidebarSection[];
        hasSession: boolean;
        nameSpace: NameSpaceEnum;
        baseHref: string;
        navigationConfig: {
            main: SidebarItem[];
            repository: SidebarSection[];
        };
        menuInstitutionSections: MenuSection[];
        languageSections: LanguageSection[];
        language: string;
        user: User | null;
        isLoadingUser: boolean;
    };
    actions: {
        t: TFunction;
        handleClose: () => void;
        setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
        onLogout: () => Promise<void>;
        changeLanguage: (newLanguage: string) => void;
    };
}
