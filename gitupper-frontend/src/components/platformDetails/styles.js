import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.alignItems || "center"};

  width: ${(props) => props.width || "auto"}px;

  border-radius: 4px;

  background-color: ${(props) => props.theme.colors.white};
`;

export const BindMessage = styled.p`
  font-family: InterMedium;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  margin-top: ${(props) => props.marginTop || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 8}px;
  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  
  color: ${(props) => props.color || props.theme.colors.black};
`;


export const PlatformDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 320px;
  border-radius: 4px;

  background-color: ${(props) => props.theme.colors.white};
`;
export const PlatformInfo = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: ${(props) => props.marginTop || 16}px;
`;

export const PlatformLabel = styled.label`
  font-family: InterRegular;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0em;

  color: ${(props) => props.color || props.theme.colors.black};
`;

export const PlatformText = styled.p`
  font-family: InterRegular;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;

  margin-top: 4px;

  color: ${(props) => props.color || props.theme.colors.black60};
`;
