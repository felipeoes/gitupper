import styled from "styled-components";

export const ErrorMessageContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 4px;
`;

export const ErrorMessageSpan = styled.span`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;

  color: ${(props) => props.theme.colors.red};
  margin-left: 8px;

  max-width: 310px;
`;
