import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => props.alignItems || "center"};

  // Mobile
  @media (max-width: 768px) {
    width: ${(props) => props.width || "100%"}px;
    margin-top: 16px;
  }

  // Desktop
  @media (min-width: 769px) {
    width: ${(props) => props.width || "auto"};
  }

  border-radius: 4px;

  background-color: ${(props) => props.theme.colors.white};
`;

export const BindMessage = styled.p`
  font-family: InterRegular;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;

  margin-top: ${(props) => props.marginTop || 8}px;
  margin-bottom: ${(props) => props.marginBottom || 8}px;
  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;

  color: ${(props) => props.color || props.theme.colors.black};
`;

export const ModalFormContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

export const StyledALink = styled.a`
  text-decoration-line: none;
  color: ${(props) => props.color || props.theme.colors.primary};

  &:hover {
    opacity: 0.8;
  }
  margin: 0;
  margin-top: ${(props) => props.marginTop || 0}px;

  width: ${(props) => props.width || "fit-content"};
  height: ${(props) => props.height || "fit-content"};
  align-self: ${(props) => props.alignSelf || "center"};
`;
