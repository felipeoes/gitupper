import styled from "styled-components";

export const ResponseContainer = styled.div`
  display: ${(props) => (props.error || props.success ? "flex" : "none")};
  align-items: center;
  height: 85px;
  width: 465px;
  border-radius: 2px;
  margin-top: 8px;

  background-color: ${(props) =>
    props.error
      ? props.theme.colors.lightRed
      : props.success
      ? props.theme.colors.secondaryLight
      : ""};

  border: ${(props) =>
    props.error
      ? `1px ${props.theme.colors.red} solid`
      : props.success
      ? `1px ${props.theme.colors.primary} solid`
      : ""};
`;

export const ResponseTextContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 18px;
`;

export const ResponseContainerText = styled.p`
  font-family: ${(props) => props.fontFamily || "InterRegular"};
  font-size: ${(props) => props.fontSize || 14}px;
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWeight || "normal"};

  line-height: ${(props) => props.lineHeight || 20}px;
  
  margin-top:  ${(props) => props.marginTop || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;
  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  
  color: ${(props) => props.color || props.theme.colors.black80};
`;
