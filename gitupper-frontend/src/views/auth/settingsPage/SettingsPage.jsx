import { useEffect, useState } from "react";
import { MdPerson, MdSettings } from "react-icons/md";
import {
  MainContainer,
  MenuContainer,
  MenuItem,
  MenuItemsContainer,
  ViewContainer,
} from "./styles";
import { paths } from "./../../../services/utils/paths";

import { MyAccount } from "./index";

const subpages = [
  {
    name: "Minha conta",
    path: paths.settingsMyAccount,
    icon: MdPerson,
    RenderPage: <MyAccount />,
  },
  {
    name: "Notificações",
    path: paths.settingsNotifications,
    icon: MdSettings,
    RenderPage: <div>Notifications</div>,
  },
  {
    name: "Privacidade",
    path: paths.settingsPrivacy,
    icon: MdSettings,
    RenderPage: <MyAccount />,
  },
  {
    name: "Ajuda",
    path: paths.settingsHelp,
    icon: MdSettings,
    RenderPage: <MyAccount />,
  },
];

const SettingsMenuItem = ({ item, onClick, active }) => {
  return (
    <MenuItem active={active} onClick={() => onClick(item.RenderPage)}>
      {item.name}
    </MenuItem>
  );
};

export default function SettingsPage() {
  const [ActivePage, setActivePage] = useState(subpages[0].RenderPage);

  function handlePageChange(Page) {
    setActivePage(Page);
  }

  const RenderPage = ActivePage;

  return (
    <MainContainer id="settings-main-container">
      <ViewContainer id="settings-view-container">
        <MenuContainer>
          <MenuItemsContainer>
            {subpages.map((item, index) => (
              <SettingsMenuItem
                key={index}
                item={item}
                onClick={(Page) => handlePageChange(Page)}
                active={ActivePage === item.RenderPage}
              />
            ))}
          </MenuItemsContainer>
        </MenuContainer>
        {RenderPage}
      </ViewContainer>
    </MainContainer>
  );
}
