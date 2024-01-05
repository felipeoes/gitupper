import styled from "styled-components";

export const StyledCheckbox = styled.input`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  accent-color: ${(props) => props.color || props.theme.colors.primary};

  background-color: ${(props) => props.bgColor || props.theme.colors.primary};

  // -webkit-appearance: none;
  // -moz-appearance: none;
  // -o-appearance: none;
  // appearance: none;

  input[type="checkbox"]:checked {
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.bgColor || props.theme.colors.primary};
  }
`;
