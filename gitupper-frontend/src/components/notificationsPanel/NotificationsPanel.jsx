import { useState, useEffect, useContext } from "react";
import { StyledBadge, NotitificationsPanelContainer } from "./styles";
import { IconButton, Fade, Divider, Popper } from "@mui/material";

import { MdOutlineNotifications } from "react-icons/md";
import { useTheme } from "styled-components";
import Notification from "./../notification/Notification";
import { NotificationsContext } from "../../contexts";

export default function NotificationsPanel({ setDrawerExpanded }) {
  const { stateNotif, dispatchNotif } = useContext(NotificationsContext);
  const { notifications, notificationUpdated } = stateNotif;

  // const [notificationsCount, setNotificationsCount] = useState(
  //   notifications.length
  // );
  const notificationsCount = notifications.length;

  const theme = useTheme();

  function handleOnRemoveNotification(notification) {
    dispatchNotif({
      type: "REMOVE_NOTIFICATION",
      payload: {
        notification,
      },
    });
  }

  useEffect(() => {
    // whenever new notifications are added, the drawer is expanded
    if (notifications.length > 0) {
      setDrawerExpanded(true);
    }
  }, [notifications.length]);

  console.log("notifications", notifications);
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
      {notifications.map(
        (notification) =>
          notification && (
            <>
              <Notification
                key={notification?.timestamp}
                notification={notification}
                notificationUpdated={notificationUpdated}
                handleOnRemoveNotification={handleOnRemoveNotification}
              />
              {notifications.indexOf(notification) !==
                notifications.length - 1 && (
                <Divider variant="fullWidth" key={notification?.timestamp} />
              )}
            </>
          )
      )}
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
