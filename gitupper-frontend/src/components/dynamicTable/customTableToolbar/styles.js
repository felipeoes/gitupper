import styled from "styled-components";

export const ToolbarText = styled.span`
  flex: "1 1 100%";
  font-family: ${(props) => props.fontFamily || "InterRegular"};
  font-size: ${(props) => props.fontSize || 16}px;
  font-weight: ${(props) => props.fontWeight || "normal"};
  color: ${(props) => props.color || "black"};

  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-top: ${(props) => props.marginTop || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;
`;

export const ToolbarNumber = styled.span`
  font-family: ${(props) => props.fontFamily || "InterBold"};
  font-size: ${(props) => props.fontSize || 16}px;
  font-weight: ${(props) => props.fontWeight || "normal"};
`;

export const ToolbarTitle = styled.p`
  font-family: ${(props) => props.fontFamily || "InterMedium"};
  font-size: ${(props) => props.fontSize || 16}px;
  font-weight: ${(props) => props.fontWeight || "500"};
  color: ${(props) => props.color || "white"};

  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-top: ${(props) => props.marginTop || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;
`;
