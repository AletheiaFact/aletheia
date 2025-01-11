import React from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`aletheia-tabpanel-${index}`}
            aria-labelledby={`aletheia-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
};

export default TabPanel;
