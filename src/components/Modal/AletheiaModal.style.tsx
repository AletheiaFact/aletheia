import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Button,
} from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import styled from "styled-components";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";

/**
 * NOTE: never set `align-self` (or any height-affecting alignment) on the
 * Dialog root. Per CSS Box Alignment, an absolutely positioned box with both
 * block offsets set (MUI's root is `position: fixed; inset: 0`) stretches to
 * its containing block by default; any other `align-self` makes it
 * shrink-to-fit, so the root becomes auto-height instead of viewport-height.
 * That breaks the percentage chain MUI relies on — `.MuiDialog-container`
 * (`height: 100%`) and `.MuiDialog-paper` (`max-height: calc(100% - 64px)`)
 * then resolve against an indefinite height. Blink still paints the content (it
 * mis-sizes the root the same way, it is just forgiving about the consequence),
 * but WebKit resolves the container to 0 and collapses `.MuiDialogContent-root`
 * (`flex: 1 1 auto` + `overflow-y: auto`, so `min-height: auto` resolves to 0)
 * to zero height, leaving a title-only modal. That hits Safari on desktop as
 * well as every browser on iOS, all of which are WebKit. Vertical placement
 * belongs on the container instead.
 */
const DefaultModal = styled(Dialog)`
    .MuiDialog-container {
        align-items: ${(props) => (props.$alignTop ? "flex-start" : "center")};
        padding-top: ${(props) => props.$offsetTop || "0"};
    }

    .MuiDialog-paper {
        width: ${(props) => (props.width ? props.width : "300px")};
        margin: 0 auto;
        border-radius: 8px;
        background-color: ${(props) =>
            props.$dark ? colors.black : colors.lightNeutral};
        box-shadow: 0px 0px 15px ${colors.shadow};
        padding: 24px;
        max-width: 90vw;
    }

    .MuiDialogTitle-root {
        color: ${(props) => (props.$dark ? colors.white : colors.black)};
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 12;
        padding: 0;
    }

    .MuiDialogActions-root {
        display: flex;
        justify-content: center;
        font-size: 24px;
        line-height: 24px;
        padding: 20px 0;
    }

    .MuiIconButton-root {
        top: 10px;
        right: 10px;
        position: absolute;
        color: ${(props) => (props.$dark ? colors.white : colors.primary)};
    }

    .MuiDialogContent-root {
        font-size: 14px;
        padding: 0;
    }

    .hide-modal {
        color: ${colors.warning};
    }

    .delete-modal {
        color: #ca1105;
    }
`;

const ModalCancelButton = styled(Button)`
    height: 40px;
    width: 120px;
    color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
    text-align: "center";
    font-weight: 700;
    font-size: 14;
`;

interface AletheiaModalProps {
    open: boolean;
    closeIcon?: React.ReactNode;
    width?: string;
    /**
     * Renders the dark variant. Deliberately NOT called `theme`: that name is
     * reserved by styled-components, so passing it here would replace the
     * styled-components theme for this modal and everything styled beneath it.
     * Nothing reads `props.theme` today, which is the only reason the old
     * `theme="dark"` was harmless — adding a styled-components ThemeProvider, or
     * any nested styled component doing `props.theme.x`, would have broken it.
     */
    dark?: boolean;
    namespace?: NameSpaceEnum;
    onCancel?: () => void;
    style?: React.CSSProperties;
    title?: React.ReactNode;
    children: React.ReactNode;
}

const AletheiaModal: React.FC<AletheiaModalProps> = ({
    open,
    closeIcon = true,
    onCancel,
    style = {},
    title,
    children,
    width,
    dark,
    namespace,
}) => {
    // Call sites express dialog placement through `style` — "pin it near the top"
    // as `{ alignSelf: "flex-start", paddingTop: "10vh" }`, or "centre it" as
    // `{ display: "flex", alignItems: "center" }`. All of these land on the root,
    // where they either break its height (see the note on DefaultModal) or turn
    // the container into a flex item and defeat MUI's own centring. Strip the
    // layout keys and express the intent on `.MuiDialog-container` instead;
    // everything else still passes through to the root untouched.
    const {
        alignSelf,
        paddingTop,
        display,
        alignItems,
        justifyContent,
        ...rootStyle
    } = style;

    return (
        <DefaultModal
            open={open}
            onClose={onCancel}
            width={width}
            namespace={namespace}
            $dark={dark}
            $alignTop={alignSelf === "flex-start"}
            $offsetTop={paddingTop}
            style={rootStyle}
        >
            <DialogTitle>
                {title}
                {typeof closeIcon === "boolean" ? (
                    <IconButton size="small" onClick={onCancel}>
                        <CloseOutlined />
                    </IconButton>
                ) : (
                    <IconButton size="small" onClick={onCancel}>
                        {closeIcon}
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
        </DefaultModal>
    );
};

export { AletheiaModal, ModalCancelButton };
