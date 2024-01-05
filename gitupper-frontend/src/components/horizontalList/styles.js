import styled from "styled-components";

export const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  padding-left: 8px;
  padding-right: ${(props) => props.paddingRight || 8}px;

  .react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar {
    display: none;
  }

  .react-horizontal-scrolling-menu--scroll-container {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .react-horizontal-scrolling-menu--item:first-child {
    margin-left: ${(props) => props.firstItemMl || 8}px;
  }

  .react-horizontal-scrolling-menu--item:last-child {
    margin-right: ${(props) => props.lastItemMr || 8}px;
  }

  .react-horizontal-scrolling-menu--scroll-container {
    flex-basis: 100%;
    flex-shrink: 0;
  }

  .react-horizontal-scrolling-menu--wrapper {
    width: ${(props) => props.scrollWidth || 450}px;
  }

  .list-item-close-icon: {
    display: none;
  }

  .list-item-close-icon:hover {
    cursor: pointer;
  }
`;

export const ArrowContainer = styled.div`
  display: flex;
  border-radius: 50%;
  background-color: ${(props) =>
    props.bgColor || props.theme.colors.transparentIcon};
  width: 41px;
  height: 41px;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-left: ${(props) => (props.left ? 0 : 8)}px;
  margin-right: ${(props) => (props.left ? 8 : 0)}px;
`;
