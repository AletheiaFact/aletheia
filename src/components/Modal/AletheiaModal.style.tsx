import { Dialog, DialogTitle, DialogContent, IconButton, Button } from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import styled from "styled-components";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";

const DefaultModal = styled(Dialog)`
  display: flex;
  justify-content: center;
  align-self: center;

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

  .MuiButtonBase-root {
    color: ${({ namespace }) =>
    namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
    font-size: 14px;
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
}) => (
  <DefaultModal
    open={open}
    onClose={onCancel}
    width={width}
    theme={theme}
    namespace={namespace}
    style={{ ...style }}
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

export { AletheiaModal, ModalCancelButton };
