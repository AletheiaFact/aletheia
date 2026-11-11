import React from "react";
import { Tab, Tabs } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { RepositoryTab } from "./repositoryFilters";

interface RepositoryTabsProps {
    value: RepositoryTab;
    onChange: (tab: RepositoryTab) => void;
}

const RepositoryTabs = ({ value, onChange }: RepositoryTabsProps) => {
    const { t } = useTranslation();

    return (
        <Tabs
            value={value}
            onChange={(_event, tab: RepositoryTab) => onChange(tab)}
            sx={{
                mt: 3,
                borderBottom: `1px solid ${colors.neutralTertiary}`,
                "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: 16,
                    minHeight: 48,
                },
                "& .Mui-selected": { color: `${colors.primary} !important` },
                "& .MuiTabs-indicator": { backgroundColor: colors.primary },
            }}
        >
            <Tab
                value="reviews"
                icon={<VerifiedUserIcon fontSize="small" />}
                iconPosition="start"
                label={t("repository:reviewsTab")}
                data-cy="testRepositoryReviewsTab"
            />
            <Tab
                value="claims"
                icon={<ChatOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label={t("repository:claimsTab")}
                data-cy="testRepositoryClaimsTab"
            />
        </Tabs>
    );
};

export default RepositoryTabs;
