import styled from "styled-components";

export const Container = styled.div`
  height: 195px;
  min-width: 443px;

  max-width: 524px;

  border-radius: 8px;

  margin: 32px;
  margin-bottom: 0;
`;

export const PlatformName = styled.span`
  font-family: InterBold;
  font-size: 16px;
  font-style: normal;

  color: ${(props) => props.platformColor || props.theme.colors.black};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 32px;
`;
