/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMatch, useResolvedPath } from "react-router-dom";
import { MdPerson, MdSettings } from "react-icons/md";
import {
  MainContainer,
  MenuContainer,
  MenuItem,
  MenuItemIconContainer,
  MenuItemsContainer,
  MenuTitle,
  ViewContainer,
} from "./styles";

import { StyledLink } from "./../../non-auth/login/styles";

const userPages = [
  {
    name: "Detalhes do usuário",
    path: "/user-profile/details",
    icon: MdPerson,
  },
  {
    name: "Plataformas",
    path: "/user-profile/bindings",
    icon: MdSettings,
  },
  {
    name: "Configurações",
    path: "/user-profile/settings",
    icon: MdSettings,
  },
];

const UserMenuItem = ({ item }) => {
  let resolved = useResolvedPath(item.path);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <StyledLink to={item.path}>
      <MenuItem className={`user-menu-item ${match ? "active" : ""}`}>
        <MenuItemIconContainer>
          <item.icon size={24} className="user-menu-item-icon" />
        </MenuItemIconContainer>

        {item.name}
      </MenuItem>
    </StyledLink>
  );
};

export default function UserProfile(props) {
  useEffect(() => {}, []);

  return (
    <MainContainer>
      <ViewContainer>
        <MenuContainer>
          <MenuTitle>Perfil</MenuTitle>
          <MenuItemsContainer>
            {userPages.map((item, index) => (
              <UserMenuItem key={index} item={item} />
            ))}
          </MenuItemsContainer>
        </MenuContainer>
      </ViewContainer>
    </MainContainer>
  );
}
