import React from "react";
import { IconButton, Popover, PopoverOrigin } from "@mui/material";

interface PopoverClickProps {
    children: React.ReactNode;
    content: React.ReactNode;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
}

const PopoverClick: React.FC<PopoverClickProps> = ({
    children,
    content,
    anchorOrigin = { vertical: "bottom", horizontal: "center" },
    transformOrigin = { vertical: "top", horizontal: "center" },
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-describedby={id}
                onClick={handleClick}
            >
                {children}
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
            >
                {content}
            </Popover>
        </>
    );
};

export default PopoverClick;
