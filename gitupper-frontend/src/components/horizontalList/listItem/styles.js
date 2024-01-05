import styled from "styled-components";

export const ListItemContainer = styled.div`
  display: flex;
  width: 100%;

  .list-item-close-icon {
    display: none;
    position: absolute;
    margin-top: -4;
    margin-left: 152;
    z-index: 12;
    elevation: 12;
  }

  :hover {
    .list-item-close-icon {
      display: flex;
      align-self: end;
      position: absolute;
      margin-top: -4;
      margin-left: 152;
      z-index: 12;
      elevation: 12;
    }
  }
`;
