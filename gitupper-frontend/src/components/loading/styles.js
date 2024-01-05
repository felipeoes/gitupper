import styled from "styled-components";

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-top: ${(props) => props.marginTop || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;

  :disabled {
    opacity: 1;
  }
`;
