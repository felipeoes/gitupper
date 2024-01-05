/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useMatch, useResolvedPath } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import { SidebarListsContainer } from "./styles";
import { StyledDivider } from "./../styles";
import { StyledLink } from "../../../views/non-auth/login/styles";

function NavbarLinkItem({
  item,
  open,
  openTooltip,
  handleCloseTooltip,
  handleOpenTooltip,
  setSelectedItem,
  theme,
}) {
  let resolved = useResolvedPath(item.path);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <StyledLink
      to={item.path}
      color="#000"
      width="100%"
      closed={(!open).toString()}
    >
      <Tooltip
        title={item.name}
        placement="right"
        open={!open && openTooltip === item.name}
        onClose={handleCloseTooltip}
        onOpen={() => handleOpenTooltip(item.name)}
      >
        <ListItem
          button
          key={item.path}
          onClick={() => item?.onClick() || setSelectedItem(item)}
          className={`list-item ${match ? "selected" : ""}`}
        >
          <ListItemIcon>
            <item.icon
              size={24}
              color={match && !open ? theme.colors.primary : theme.colors.white}
            />
          </ListItemIcon>
          <ListItemText disableTypography primary={item.name} />
        </ListItem>
      </Tooltip>
    </StyledLink>
  );
}

export default function SideBarLists({
  openDrawer,
  setSelectedItem,
  theme,
  primaryItemsList,
  secondaryItemsList,
}) {
  const [openTooltip, setOpenTooltip] = useState(null);
  const handleCloseTooltip = () => {
    setOpenTooltip(null);
  };

  const handleOpenTooltip = (name) => {
    setOpenTooltip(name);
  };

  function getActualPath() {
    const path = window.location.pathname;

    if (path.includes("settings")) {
      return {
        name: "Configurações",
        path: "/settings",
      };
    }

    const actualPath = primaryItemsList
      .concat(secondaryItemsList)
      .find((item) => item.path.includes(path));

    return actualPath;
  }

  useEffect(() => {
    !openDrawer && handleCloseTooltip();

    setSelectedItem(getActualPath());
  }, [openDrawer]);

  return (
    <SidebarListsContainer>
      <List className="sidebar-list-0">
        {primaryItemsList.map((item, index) => (
          <NavbarLinkItem
            item={item}
            key={index}
            open={openDrawer}
            openTooltip={openTooltip}
            handleCloseTooltip={handleCloseTooltip}
            handleOpenTooltip={handleOpenTooltip}
            setSelectedItem={setSelectedItem}
            theme={theme}
          />
        ))}
      </List>

      <List className="sidebar-list-1">
        <StyledDivider marginLeft={10} marginRight={10} marginBottom={6} />
        {secondaryItemsList.map((item, index) => (
          <NavbarLinkItem
            item={item}
            key={index}
            open={openDrawer}
            openTooltip={openTooltip}
            handleCloseTooltip={handleCloseTooltip}
            handleOpenTooltip={handleOpenTooltip}
            setSelectedItem={setSelectedItem}
            theme={theme}
          />
        ))}
      </List>
    </SidebarListsContainer>
  );
}