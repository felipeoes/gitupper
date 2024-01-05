import { useState, useEffect, useContext } from "react";
import { StyledBadge, NotitificationsPanelContainer } from "./styles";
import { IconButton, Fade, Divider, Popper } from "@mui/material";

import { MdOutlineNotifications } from "react-icons/md";
import { useTheme } from "styled-components";
import Notification from "./../notification/Notification";
import { NotificationsContext } from "../../contexts";

export default function NotificationsPanel() {
  const { stateNotif } = useContext(NotificationsContext);
  const notifications = stateNotif.notifications;

  const [notificationsCount, setNotificationsCount] = useState(
    notifications.length
  );
  // const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();

  function onClickNotificationsButton(event) {
    setNotificationsCount(0);
    setAnchorEl(event.currentTarget);
    // setOpen((previousOpen) => !previousOpen);
  }

  useEffect(() => {
    setNotificationsCount(notifications.length);
  }, [notifications]);

  // const canBeOpen = open && Boolean(anchorEl);
  const canBeOpen = Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  return (
    // <StyledBadge badgeContent={notificationsCount}>
    //   <IconButton
    //     size={"large"}
    //     onClick={onClickNotificationsButton}
    //     sx={{
    //       alignSelf: "end",
    //     }}
    //   >
    //     <MdOutlineNotifications color={theme.colors.iconColor} />
    //   </IconButton>
    // <Popper
    //   id={id}
    //   // open={open}
    //   anchorEl={anchorEl}
    //   transition
    //   placement="bottom-end"
    //   style={{
    //     backgroundColor: "white",
    //     zIndex: 100,
    //   }}
    // >
    //   {({ TransitionProps }) => (
    //     <Fade {...TransitionProps} timeout={350}>
          <NotitificationsPanelContainer>
            {notifications.map((notification) => (
              <>
                <Notification
                  key={notification.id}
                  notification={notification}
                />

                {notifications.indexOf(notification) !==
                  notifications.length - 1 && (
                  <Divider variant="fullWidth" key={notification.id} />
                )}
              </>
            ))}
            {notifications.length === 0 && (
              <div>
                <p>Nenhuma notificação recente</p>
              </div>
            )}
          </NotitificationsPanelContainer>
    //     </Fade>
    //   )}
    // </Popper>
    // </StyledBadge>
  );
}
