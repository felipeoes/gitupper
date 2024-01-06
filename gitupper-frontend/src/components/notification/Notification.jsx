import { useState } from "react";
import parse from "html-react-parser";
import { useTheme } from "styled-components";

import {
  NotificationContainer,
  NotificationContentContainer,
  NotificationHeader,
  NotificationSubtitle,
  NotificationTitle,
  SubmissionJobContainer,
} from "./styles";

import { StyledLink } from "../../views/non-auth/login/styles";
import Button from "../button/Button";
import { Box, IconButton } from "@mui/material";
import {
  MdCheckCircleOutline,
  MdDelete,
  MdWorkspacesFilled,
} from "react-icons/md";
import CircularProgress from "../progress/CircularProgress";
import { StyledALink } from "../../views/auth/platforms/styles";

export default function Notification({
  notification,
  notificationUpdated,
  handleOnRemoveNotification,
}) {
  const theme = useTheme();
  function getTimeElapsed(date) {
    // if it less than 60 minutes, return minutes. If it's more than 60 minutes, return hours
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);

    const timeObj = {
      now: minutes > 1 ? false : true,
      time:
        minutes < 60
          ? `${minutes} minutos`
          : `${Math.floor(minutes / 60)} horas`,
    };

    return timeObj;
  }

  function parseNotificationContent(content) {
    // o content pode ser um objeto que foi serializado no localStorage, precisa dar um parse
    try {
      return parse(content);
    } catch (error) {
      return content;
    }
  }

  function SubmissionJobProgress({ value }) {
    const [hovering, setHovering] = useState(false);

    function SubmissionJobProgresssContent({ value }) {
      if (value === 100) {
        return (
          <IconButton
            size="small"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => handleOnRemoveNotification(notification)}
          >
            {hovering ? (
              <MdDelete color={theme.colors.primary} size={24} />
            ) : (
              <MdCheckCircleOutline color={theme.colors.primary} size={24} />
            )}
          </IconButton>
        );
      } else if (value < 100 && value > 0) {
        return (
          <IconButton
            size="small"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => handleOnRemoveNotification(notification)}
          >
            {hovering ? (
              <MdDelete color={theme.colors.primary} size={24} />
            ) : (
              <CircularProgress value={value} />
            )}
          </IconButton>
        );
      } else {
        return (
          <IconButton
            size="small"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => handleOnRemoveNotification(notification)}
          >
            {hovering ? (
              <MdDelete color={theme.colors.primary} size={24} />
            ) : (
              <CircularProgress />
            )}
          </IconButton>
        );
      }
    }

    return (
      <Box>
        <SubmissionJobProgresssContent value={value} />
      </Box>
    );
  }

  console.log("notif", notification);

  return (
    <NotificationContainer>
      {notification?.type === "submission_job" ? (
        <SubmissionJobContainer>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <IconButton
                sx={{
                  color: theme.colors.iconColor,
                  marginRight: 1,
                }}
              >
                <MdWorkspacesFilled
                  style={{
                    fontSize: 24,
                  }}
                />
              </IconButton>
              {parseNotificationContent(notification.content)}
            </Box>

            {notification.repoLink && (
              <StyledALink
                href={notification.repoLink}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  marginTop={8}
                  marginBottom={8}
                  bgColor={theme.colors.primary}
                  width={240}
                >
                  Acessar repositório
                </Button>
              </StyledALink>
            )}
          </Box>
          <SubmissionJobProgress value={notification.value} />
        </SubmissionJobContainer>
      ) : (
        <>
          <NotificationHeader>
            <NotificationTitle>{notification.title}</NotificationTitle>
            <IconButton
              size="small"
              onClick={() => handleOnRemoveNotification(notification)}
            >
              <MdDelete color={theme.colors.iconColor} size={20} />
            </IconButton>
          </NotificationHeader>

          <NotificationSubtitle>
            {getTimeElapsed(notification.timestamp).now
              ? "agora há pouco"
              : `há ${getTimeElapsed(notification.timestamp).time}`}
          </NotificationSubtitle>

          <NotificationContentContainer>
            {parseNotificationContent(notification.content)}

            {notification?.type === "invalid_token" && (
              <StyledLink to="/settings" id="update-credentials">
                <Button
                  marginTop={16}
                  marginBottom={16}
                  bgColor={theme.colors.primary}
                  width={240}
                >
                  Atualizar credenciais
                </Button>
              </StyledLink>
            )}
          </NotificationContentContainer>
        </>
      )}
    </NotificationContainer>
  );
}
