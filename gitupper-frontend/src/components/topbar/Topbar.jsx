/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import { useTheme } from "styled-components";

import {
  TopbarContainer,
  UserIcon,
  TopbarUserContainer,
  TopbarIconsContainer,
  TopbarText,
} from "./styles";
import AuthContext from "../../contexts/auth";
import DropdownMenu from "./../dropdownMenu/DropdownMenu";

import Button from "../button/Button";
import { StyledLink } from "../../views/non-auth/login/styles";
import NotificationsPanel from "../notificationsPanel/NotificationsPanel";

export function Topbar({
  clean,
  nonAuth,
  topbarButtonText,
  toPath,
  IconElement,
  RightElement,
  bgColor,
  iconMarginLeft,
  disableElevation,
  onClickButton,
  disabledButtons,
}) {
  const context = useContext(AuthContext);
  const { state } = context;
  const theme = useTheme();
  const user = state.user;

  async function handleOnLogout() {
    await context.Logout();
  }

  return (
    <TopbarContainer bgColor={bgColor} disableElevation={disableElevation}>
      {clean ? (
        <>
          <TopbarIconsContainer marginLeft={iconMarginLeft}>
            {IconElement}
          </TopbarIconsContainer>
          {/* <NotificationsPanel /> */}
          {RightElement}
        </>
      ) : (
        <>
          <TopbarUserContainer>
            {!nonAuth ? (
              <>
                <DropdownMenu
                  logout
                  onClickLogout={handleOnLogout}
                  UserIcon={<UserIcon src={`${user.profile_image}`} />}
                />
                <TopbarText>Olá, {user.first_name}</TopbarText>
              </>
            ) : (
              <TopbarIconsContainer marginLeft={iconMarginLeft}>
                {IconElement}
              </TopbarIconsContainer>
            )}
          </TopbarUserContainer>

          <StyledLink to={toPath || ""} disabled={disabledButtons}>
            <Button
              width={160}
              marginRight={96}
              // bgColor={theme.colors.primary}
              bgColor="transparent"
              color={theme.colors.primary}
              disableElevation
              onClick={onClickButton}
              disabled={disabledButtons}
            >
              {topbarButtonText}
            </Button>
          </StyledLink>
        </>
      )}
    </TopbarContainer>
  );
}
