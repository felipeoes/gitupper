import styled from "styled-components";

export const FilterViewContainer = styled.div`
  display: flex;

  flex-direction: column;
`;

export const ApplyButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: ${(props) => props.marginTop || 24}px;
`;

export const CustomizedViewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
  width: 100%;
  margin-top: 8px;
`;
