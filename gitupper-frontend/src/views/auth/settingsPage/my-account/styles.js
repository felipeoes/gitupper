import styled from "styled-components";

export const ItemTitle = styled.p`
  font-family: "InterRegular";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;

  color: ${(props) => props.theme.colors.blackLight};
  margin-top: ${(props) => props.marginTop || "0px"};
  margin-bottom: ${(props) => props.marginBottom || "12px"};
`;

export const ItemSubtitle = styled.p`
  font-family: "InterRegular";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;

  margin: 0;
`;

export const ProfileItemsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 23px;
`;
