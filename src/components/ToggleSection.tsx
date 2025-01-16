import { ButtonGroup, Button } from "@mui/material";
import styled from "styled-components";
import colors from "../styles/colors";
import { NameSpaceEnum } from "../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { useState } from "react";

const StyledButton = styled(Button)<{ namespace: NameSpaceEnum; selected: boolean }>`
  background: ${({ namespace, selected }) =>
    selected
      ? namespace === NameSpaceEnum.Main
        ? colors.primary
        : colors.secondary
      : colors.neutralTertiary};
  color: ${({ selected }) => ( selected )};
  border-radius: 30px;

  &:hover {
    background: ${({ namespace }) =>
      namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
    color: ${colors.white};
  }

  &:not(:hover) {
    background: ${({ namespace, selected }) =>
      selected
        ? namespace === NameSpaceEnum.Main
          ? colors.primary
          : colors.secondary
        : colors.neutralTertiary};
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
    visibility: hidden;
    position: relative;

  > * {
    visibility: visible;
    position: relative;
  }
`;

interface ToggleSectionProps {
  defaultValue: boolean;
  onChange: (event: any) => void;
  labelTrue: string;
  labelFalse: string;
}

const ToggleSection = (props: ToggleSectionProps) => {
  const [nameSpace] = useAtom(currentNameSpace);
  const [selectedValue, setSelectedValue] = useState<boolean>(props.defaultValue);

  const handleChange = (value: boolean) => {
    setSelectedValue(value);
    const event = { target: { value } };
    props.onChange(event as any);
  };

  return (
      <StyledButtonGroup variant="contained" aria-label="toggle section">
      <StyledButton
        selected={selectedValue === true}
        onClick={() => handleChange(true)}
        namespace={nameSpace}
        style={{ borderRadius: "30px 0px 0px 30px" }}
        >
        {props.labelTrue}
      </StyledButton>
      <StyledButton
        selected={selectedValue === false}
        onClick={() => handleChange(false)}
        namespace={nameSpace}
        style={{ borderRadius: "0px 30px 30px 0px" }}
        >
        {props.labelFalse}
      </StyledButton>
      </StyledButtonGroup>
  );
};

export default ToggleSection;
