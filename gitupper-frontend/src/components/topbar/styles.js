import styled from "styled-components";
import { Link } from "react-router-dom";

export const TopbarContainer = styled.div`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  position: sticky;

  justify-content: space-between;
  background-color: ${(props) => props.bgColor || "transparent"};

  ${(props) =>
    props.disableElevation
      ? "elevation: none; box-shadow:none"
      : "elevation: 6; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);"}
`;

export const TopbarIconsContainer = styled.div`
  display: flex;
  align-items: center;


  margin-left: ${(props) => props.marginLeft || 0}px;
`;

export const TopbarUserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-left: 135px;
`;

export const UserIcon = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: "transparent";
  color: "transparent";
`;

export const TopbarUL = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TopbarLI = styled.li`
  border-bottom: 1px solid #dddddd;
`;

export const TopbarLink = styled(Link)`
  font-family: MontserratLight;
  font-size: 14px;
  text-decoration: none;
  color: #333333;
  padding: 15px 20px;
  display: block;
  border-radius: 3px;

  &:hover {
    background-color: rgba(159, 162, 180, 0.08);
  }
`;

export const TopbarText = styled.span`
  font-family: InterMedium;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  padding-left: 16px;

  color: ${(props) => props.color || props.theme.colors.black};
`;
