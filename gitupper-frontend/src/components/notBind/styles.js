import { Box } from "@mui/material";
import { styled as styledMUI } from "@mui/material/styles";

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 40%;

  padding-top: 32px;
  padding-left: 32px;

  background-color: ${(props) => props.theme.colors.lightGreen};
`;

export const ContainerTitle = styled.p`
  font-family: "InterSemiBold";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  display: flex;
  align-items: center;
`;

export const ContainerContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContainerText = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;

  color: ${(props) => props.theme.colors.black60};
`;

export const ColoredText = styled.span`
  color: ${(props) => props.color || props.theme.colors.primary};
  text-transform: uppercase;
`;

export const ContainerButton = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
