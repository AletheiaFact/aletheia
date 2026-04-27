import { useAtom } from "jotai";
import { currentUserId, currentUserRole } from "../../atoms/currentUser";
import { useMemo, useState } from "react";
import { currentNameSpace } from "../../atoms/namespace";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { NameSpaceEnum } from "../../types/Namespace";
import { CreateLogoutHandler } from "../Login/LogoutAction";

import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";

import { isAdmin, isStaff } from "../../utils/GetUserPermission";

export const useHeaderData = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const [nameSpace] = useAtom(currentNameSpace);
    const [userId] = useAtom(currentUserId);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [role] = useAtom(currentUserRole);
    const [isLoading, setIsLoading] = useState(false);

    const baseHref = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    const hasSession = !!userId;

    const loginOrProfile = () => {
        handleClose();
        router.push(`${baseHref}/profile`);
    };

    const onSignUp = () => {
        handleClose();
        router.push(`${baseHref}/sign-up`);
    };

    const onLogout = async () => {
        if (!isLoading) {
            setIsLoading(true);
            await CreateLogoutHandler();
            if (nameSpace !== NameSpaceEnum.Main) {
                router.push("/");
            } else {
                router.reload();
            }
        }
        handleClose();
    };


    const handleClose = () => {
        setAnchorEl(null);
    };

    const buildMyAccountSections = () => {
        const sections = [];

        sections.push({
            title: "myAccount",
            items: [
                {
                    icon: hasSession ? <PersonIcon /> : <LoginIcon />,
                    key: hasSession ? "myAccount" : "login",
                    action: loginOrProfile,
                    dataCy: `test${hasSession ? "Profile" : "Login"}Item`,
                },
                {
                    icon: hasSession ? <LogoutIcon /> : <PersonAddIcon />,
                    key: hasSession ? "logout" : "signUp",
                    action: hasSession ? onLogout : onSignUp,
                    dataCy: `test${hasSession ? "Logout" : "Register"}Item`,
                    isDestructive: hasSession,
                },
            ],
        });

        const workspaceItems = [];

        if (hasSession && isStaff(role)) {
            workspaceItems.push({
                icon: <WorkOutlineOutlinedIcon />,
                key: "kanban",
                path: `${baseHref}/kanban`,
                dataCy: "testKanbanItem",
            });
        }

        if (hasSession && isAdmin(role)) {
            workspaceItems.push({
                icon: <ShieldOutlinedIcon />,
                key: "admin",
                path: `${baseHref}/admin`,
                dataCy: "testadminItem",
            });
            workspaceItems.push({
                icon: <WorkspacePremiumOutlinedIcon />,
                key: "badges",
                path: `${baseHref}/admin/badges`,
                dataCy: "testbadgesItem",
            });
            workspaceItems.push({
                icon: <NumbersOutlinedIcon />,
                key: "nameSpace",
                path: `${baseHref}/admin/name-spaces`,
                dataCy: "testnamespaceItem",
            });
        }

        if (workspaceItems.length > 0) {
            sections.push({
                title: "workspace",
                items: workspaceItems,
            });
        }

        return sections;
    };

    const myAccountSections = buildMyAccountSections();

    const navigationConfig = useMemo(() => ({
        main: [
            {
                key: "verificationRequest",
                path: `${baseHref}/verification-request`,
                dataCy: "testVerificationRequestNavLink",
            },
            {
                key: "event",
                path: `${baseHref}/event`,
                dataCy: "testEventNavLink",
            },
        ],
        repository: [
            {
                title: "repository",
                items: [
                    {
                        icon: <PortraitOutlinedIcon />,
                        key: "personality",
                        path: `${baseHref}/personality`,
                        showIcon: false,
                    },
                    {
                        icon: <FactCheckOutlinedIcon />,
                        key: "claim",
                        path: `${baseHref}/claim`,
                        showIcon: false,
                    },
                ]
            }
        ]
    }), [baseHref]);

    const menuInstitutionSections = [
        {
            title: "platform",
            items: [
                {
                    icon: <InfoOutlinedIcon />,
                    key: "aboutUs",
                    path: "/about",
                },
                {
                    icon: <MenuBookOutlinedIcon />,
                    key: "supportiveMaterials",
                    path: "/supportive-materials",
                },
            ],
        },
        {
            title: "legal",
            items: [
                {
                    icon: <DescriptionOutlinedIcon />,
                    key: "privacyPolicy",
                    path: "/privacy-policy",
                },
                {
                    icon: <BalanceOutlinedIcon />,
                    key: "codeOfConduct",
                    path: "/code-of-conduct",
                },
            ],
        },
    ];

    return {
        state: {
            userId,
            isLoading,
            anchorEl,
            isOpen: Boolean(anchorEl),
            myAccountSections,
            hasSession,
            nameSpace,
            baseHref,
            navigationConfig,
            menuInstitutionSections
        },
        actions: {
            t,
            handleClose,
            setAnchorEl,
            onLogout,
        }
    };
};
