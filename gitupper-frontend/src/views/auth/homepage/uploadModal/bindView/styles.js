import styled from "styled-components";

export const BindViewText = styled.p`
  font-family: InterRegular;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  
  margin: 0;
  color: ${(props) => props.color || props.theme.colors.black60};
`;
