import styled from "styled-components";

export const PaginateContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  

  ul {
    display: flex;
    justify-content: space-between;
    list-style: none;
    cursor: pointer;
  }

  a {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #6c7ac9;
    color: #2940D3;
  }
`;
