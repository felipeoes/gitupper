import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";

export const ModalContainer = styled.div`
  display: ${(props) => (props.hidden ? "none" : "block")};
  height: auto;
  width: auto;

  border-radius: 8px;
  background-color: white;
  align-items: center;
  justify-content: center;

  background: #ffffff;

  border: 1px solid #e3e6eb;
  box-sizing: border-box;
  /* Shadow Card */

  box-shadow: 0px 7px 20px rgba(40, 41, 61, 0.08);
  border-radius: 8px;

  transition: all ease 1s;

  background-color: ${(props) => props.bgColor || props.theme.colors.white};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  width: 100%;
  margin-bottom: 0;
`;

export const ModalHeaderTabContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  height: 33px;
  width: 200px;
  border-radius: 0px;
  margin-right: 18px;
`;

export const ModalHeaderTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 80px;
  height: 33px;
`;

export const ModalHeaderTabTitle = styled.div`
  font-family: MontserratRegular;
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;

  color: #2940d3;
`;

export const ModalHeaderTabDivider = styled.div`
  height: 2px;
  width: 82px;
  margin-top: 10px;
  background: #2940d3;
`;

export const ModalTitle = styled.h1`
  font-family: MontserratRegular;
  color: #252733;
  letter-spacing: 0.4px;
  font-size: 19px;
  margin-top: 0.75rem;
`;

export const ModalContentContainer = styled.div`
  display: flex;
  height: auto;
  margin: 0;
`;
