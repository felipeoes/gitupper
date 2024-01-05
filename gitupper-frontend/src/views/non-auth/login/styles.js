import styled from "styled-components";
import { Link } from "react-router-dom";

const containerWidth = 465;

export const AuthContainer = styled.div`
  justify-content: center;
  width: 100%;
  height: 100%;

  background-color: ${(props) => props.theme.colors.white};
`;

export const AuthLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const AuthLeftContainerContent = styled.div`
  display: flex;
  flex-direction: column;

  width: ${containerWidth}px;
  margin-top: ${(props) => props.marginTop || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;
`;
export const AuthLeftContainerHeader = styled.div`
  margin-top: ${(props) => props.marginTop || 24}px;

  width: ${containerWidth}px;

  color: ${(props) => props.theme.colors.white};
`;

export const LoginOrRegisterMessage = styled.p`
  font-family: InterSemiBold;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;

  margin-bottom: 0;
  margin-top: 16px;

  color: ${(props) => props.theme.colors.black};
`;

export const StyledLink = styled(Link)`
  display: ${(props) => (props.inline ? "" : "flex")};
  align-items: center;
  justify-content: center;

  font-family: ${(props) => props.fontFamily || "InterSemiBold"};
  font-size: ${(props) => props.fontSize || 16}px;
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || "normal"};

  text-decoration-line: none;
  color: ${(props) => props.color || props.theme.colors.primary};

  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-top: ${(props) => props.marginTop || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;

  width: ${(props) => props.width || "fit-content"};

  ${(props) => (props.disabled ? "pointer-events: none;" : "")}

  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const AuthLeftContainerHeaderSubtitle = styled.p`
  width: 100%;
  margin-top: 8px;

  font-family: InterRegular;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  text-align: left;
  line-height: 22px;

  color: ${(props) =>
    props.color ? props.color : props.theme.colors.disabledButton};
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: ${containerWidth}px;

  margin-top: ${(props) => props.marginTop || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;
`;

export const LoginContainerDividerText = styled.p`
  font-family: InterRegular;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  line-height: 22px;

  margin-top: 28px;

  color: ${(props) => props.theme.colors.black};
`;

export const LoginOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 20px;

  margin-top: 16px;
`;

export const LoginOptionsText = styled.p`
  width: ${(props) => props.width || "auto"};

  text-align: ${(props) => props.textAlign || "none"};
  font-family: InterMedium;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;

  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-top: ${(props) => props.marginTop || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;

  color: ${(props) => props.color || props.theme.colors.black};
`;

export const RememberMeContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: ${(props) => props.width || "100%"}px;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

export const LoginFormContainer = styled.form``;

export const AuthRightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;

  margin-top: 56px;
`;

export const LottieContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 128px;
`;

export const GithubOauthLink = styled.a`
  text-decoration: none;

  margin-top: ${(props) => props.marginTop || 24}px;
`;
