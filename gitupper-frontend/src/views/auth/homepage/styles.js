import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${(props) => props.theme.colors.white};

  height: 100%;
  width: 100%;
`;

export const ViewContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-left: 72px;
  padding-right: 72px;

  background-color: ${(props) => props.theme.colors.white};
`;

export const TableContainer = styled.div``;

export const DashboardBanner = styled.div`
  display: flex;
  height: 112px;
  width: 975px;

  align-items: center;
  justify-content: center;

  background: ${(props) => props.theme.colors.primary};
  border-radius: 4px;
`;

export const DashboardButtonsContainer = styled.div`
  display: ${(props) => (props.visible ? "flex" : "flex")};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  align-self: start;

  margin-top: 20px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.colors.primary};
`;
