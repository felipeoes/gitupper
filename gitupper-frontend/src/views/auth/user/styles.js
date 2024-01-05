import styled from "styled-components";

export const MainContainer = styled.div`
  display: flex;

  background: #f0f0f0;
  width: 100%;
  height: 100%;

  font-family: InterRegular;
`;

export const ViewContainer = styled.div`
  display: flex;

  background-color: ${(props) => props.theme.colors.white};

  margin-left: 72px;
  margin-top: 64px;
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 256px;
  width: 258px;

  background: #ffffff;
  box-shadow: 0px 7px 20px rgba(40, 41, 61, 0.08);
  border-radius: 8px;
  margin: 20px;

  .user-menu-item.active {
    background-color: #f5f5f7;

    .user-menu-item-icon {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

export const UserInfoContainer = styled.div`
  height: 500px;
  width: 739px;
  background: #ffffff;

  box-shadow: 0px 7px 20px rgba(40, 41, 61, 0.08);
  border-radius: 8px;
  overflow: auto;
  margin: 20px;
`;

export const MenuTitle = styled.h1`
  font-family: InterBold;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;

  text-align: center;
  color: #3a3c40;
`;

export const MenuItemsContainer = styled.ul`
  height: 100%;
  list-style: none;
  padding: 0;
`;

export const MenuItem = styled.li`
  display: flex;
  align-items: center;
  padding-left: 1rem;

  height: 36px;
  cursor: pointer;

  font-size: 14px;
  color: #3a3c40;
  vertical-align: middle;

  :hover {
    background-color: #f5f5f7;

    .user-menu-item-icon {
      color: ${(props) => props.theme.colors.primary};
    }
  }

  a {
    text-decoration-line: none;
  }
`;

export const MenuItemIconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;
