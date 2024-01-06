import styled from "styled-components";

export const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

export const ProfileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 32px;
  margin-top: 23px;
  margin-bottom: 23px;
  width: "100%";
`;

export const ProfileNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24px;
`;

export const ProfileName = styled.p`
  font-family: InterSemiBold;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  margin: 0;

  color: ${(props) => props.theme.colors.blackLight};
`;

export const ProfileID = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;

  margin: 0;
  margin-top:-4px;

  color: ${(props) => props.theme.colors.iconColor};
`;
