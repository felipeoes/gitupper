import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;

  background: ${(props) => props.theme.colors.white};
  width: 100%;
  height: 100%;
  overflow: auto;
  font-family: "InterRegular";
`;

export const SubPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  margin-left: 1.7rem;
  height: 100%;
  overflow: auto;
`;

export const SubContainer = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;
  width: 100%;

  background-color: ${(props) => props.theme.colors.transparentIcon};
  border-radius: 4px;
`;

export const ViewContainer = styled.div`
  display: flex;

  background-color: ${(props) => props.theme.colors.white};

  width: 95%;
  margin-left: 52px;
  overflow: auto;
  height: 100%;
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: fit-content;

  height: auto;

  /* .user-menu-item.active {
    background-color: rgba(200, 200, 200, 0.2);
    color: ${(props) => props.theme.colors.primary};
  } */
`;

export const MenuItemsContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  height: fit-content;
`;

export const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding-left: 1.5rem;

  height: 36px;
  cursor: pointer;
  width: 100%;

  font-family: ${(props) => (props.active ? "InterBold" : "InterRegular")};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;

  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.blackLight};
  vertical-align: middle;
  border-radius: 4px;

  :hover {
    background-color: rgba(200, 200, 200, 0.2);
  }

  ${(props) =>
    props.active &&
    `
    background-color: rgba(200, 200, 200, 0.2);
  `}
`;
