import { Dialog, DialogTitle, DialogContent, IconButton, Button } from "@mui/material";
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
 * then resolve against an indefinite height. Chromium tolerates it, but WebKit
 * collapses `.MuiDialogContent-root` (`flex: 1 1 auto` + `overflow-y: auto`,
 * so `min-height: auto` resolves to 0) to zero height, rendering a title-only
 * modal on iOS Safari. Vertical placement belongs on the container instead.
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
    props.theme === "dark" ? colors.black : colors.lightNeutral};
    box-shadow: 0px 0px 15px ${colors.shadow};
    padding: 24px;
    max-width: 90vw;
  }

  .MuiDialogTitle-root {
    color: ${(props) => props.theme === "dark" ? colors.white : colors.black};
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
    color: ${(props) =>
    props.theme === "dark" ? colors.white : colors.primary};
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
    namespace === NameSpaceEnum.Main
      ? colors.primary
      : colors.secondary};
    text-align: "center";
    font-weight: 700;
    font-size: 14;
`;

interface AletheiaModalProps {
  open: boolean;
  closeIcon?: React.ReactNode;
  width?: string;
  theme?: string;
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
  theme,
  namespace
}) => {
  // Call sites express "pin the dialog near the top" as
  // `style={{ alignSelf: "flex-start", paddingTop: "10vh" }}`. Applied to the
  // root that silently breaks the dialog (see the note on DefaultModal), so
  // translate it onto `.MuiDialog-container`, where MUI does its own vertical
  // alignment. Remaining style keys still pass through to the root untouched.
  const { alignSelf, paddingTop, ...rootStyle } = style;

  return (
    <DefaultModal
      open={open}
      onClose={onCancel}
      width={width}
      theme={theme}
      namespace={namespace}
      $alignTop={alignSelf === "flex-start"}
      $offsetTop={paddingTop}
      style={rootStyle}
    >
      <DialogTitle>
        {title}
        {typeof closeIcon === 'boolean' ? (
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
