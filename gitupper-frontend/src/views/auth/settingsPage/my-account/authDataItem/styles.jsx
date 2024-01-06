import styled from "styled-components";

export const AuthDataContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: ${(props) => props.theme.colors.transparentIcon};
  border-radius: 4px;
`;

export const AuthDataItemContainer = styled.div`
  display: flex;
  justify-content: space-between;

  align-items: center;
  width: 100%;
  font-family: "InterRegular";

  padding-left: 32px;
  padding-top: ${(props) => props.paddingTop || "20px"};
  padding-bottom: ${(props) => props.paddingBottom || "0px"};
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-left: ${(props) => props.marginLeft || "0"}px;
`;

export const AuthDataLabel = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;

  margin: 0;
`;

export const AuthDataText = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;

  margin: 0;
  color: ${(props) => props.color || props.theme.colors.black};
`;
