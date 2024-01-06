import styled from "styled-components";

export const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const NotificationHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* height: 48px;
  padding: 0 16px; */
`;

export const NotificationTitle = styled.h2`
  font-family: "InterSemiBold";
  font-size: 16px;
  font-weight: 600;
  font-style: normal;
  color: ${(props) => props.theme.colors.black80};
  margin-bottom: 0;
`;

export const NotificationSubtitle = styled.span`
  font-family: "InterMedium";
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  color: ${(props) => props.theme.colors.black60};
  margin-top: 8;
`;

export const NotificationContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: InterRegular;
  font-size: 14px;
`;

export const SubmissionJobContainer = styled.div`
  display: flex;
  flex-direction: space-between;
  width: 100%;
  margin-top: 16px;
  font-family: InterRegular;
  font-size: 14px;
`;
