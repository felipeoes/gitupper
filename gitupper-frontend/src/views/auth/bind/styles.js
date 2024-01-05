import styled from "styled-components";
import Button from "@mui/material/Button";

export const BindContainer = styled.div`
  width: 100%;
  height: 100%;

  background-color: ${(props) => props.theme.colors.white};
`;

export const BindTextsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 135px;
  margin-top: 24px;
`;

export const BindTitle = styled.h1`
  font-family: InterSemiBold;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin: 0;

  color: ${(props) => props.theme.colors.blackLight};
`;

export const BindSubtitle = styled.h2`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;

  color: ${(props) => props.theme.colors.disabledButton};
`;

export const BindPlatforms = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

export const BindContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledButton = styled(Button)`
  color: ${(props) => props.theme.colors.extraWhite};
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 8px;

  &:disabled {
    opacity: 1;

    border: none;

    .dots-icon-container {
      opacity: 1;
      elevation: 3;
      z-index: 3;
      cursor: pointer;
      pointer-events: auto;

      &:disabled {
        opacity: 1;
      }
    }
  }
`;

export const PlatformLogo = styled.img`
  width: 120px;
  height: 100px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
`;

export const PlatformName = styled.h3`
  font-family: InterBold;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 48px;
  letter-spacing: 0em;

  color: ${(props) => props.color || props.theme.colors.primary};

  text-transform: none;
`;

export const DotsIconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 3.7%;
  top: 3.04%;

  color: ${(props) => props.theme.colors.semiGray};
  opacity: 0.75;

  width: fit-content;
  height: 24px;

  cursor: pointer;
`;

export const BindIconContainer = styled.div`
  position: absolute;
  left: 14px;
  top: 14px;
`;

export const BindIcon = styled.img`
  height: 24px;
  width: 24px;
`;
