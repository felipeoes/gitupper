import ReactDOMServer from "react-dom/server";
import parse from "html-react-parser";

import {
  NotificationContainer,
  NotificationContentContainer,
  NotificationSubtitle,
  NotificationTitle,
} from "./styles";

export default function Notification({ notification }) {
  function getNotificationMinutesElapsed(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes;
  }

  function serializeNotificationContent(content) {
    return ReactDOMServer.renderToString(content);
  }

  function desserializeNotificationContent(content) {
    return ReactDOMServer.render;
  }

  function parseNotificationContent(content) {
    // o content pode ser um objeto que foi serializado no localStorage, precisa dar um parse
    try {
      return parse(content);
    } catch (error) {
      return content;
    }
  }

  return (
    <NotificationContainer>
      <NotificationTitle>{notification.title}</NotificationTitle>
      <NotificationSubtitle>
        {getNotificationMinutesElapsed(notification.timestamp) > 1
          ? `há ${getNotificationMinutesElapsed(
              notification.timestamp
            )} minutos`
          : `agora há pouco`}
      </NotificationSubtitle>

      <NotificationContentContainer>
        {parseNotificationContent(notification.content)}
      </NotificationContentContainer>
    </NotificationContainer>
  );
}
