import { createContext, useReducer } from "react";
import ReactDOMServer from "react-dom/server";

const NotificationsContext = createContext({});

const initialState = {
  notifications: JSON.parse(sessionStorage.getItem("notifications")) || [],
  offset: JSON.parse(sessionStorage.getItem("offset")) || 0,
};

function saveNotifications(notifications) {
  sessionStorage.setItem("notifications", JSON.stringify(notifications));
}

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      let notification = action.payload.notification;

      let newOffset = state.offset;
      // adiciona o ID da notificação com base no offset
      notification.id = state.offset;

      // checks if thre is already a notification with the same id and increments offset
      state.notifications.forEach((notif) => {
        if (notif.id === state.offset) {
          newOffset = newOffset + 1;
          notification.id = newOffset;
        }
      });

      // serializes notification content.
      notification.content = ReactDOMServer.renderToString(
        notification.content
      );

      // adiciona a notificação no array de notificações
      const newNotifications = [...state.notifications, notification];

      // salva o array de notificações no sessionStorage
      saveNotifications(newNotifications);

      // incrementa o offset
      newOffset = state.offset + 1;
      sessionStorage.setItem("offset", JSON.stringify(newOffset));

      // retorna o novo array de notificações
      return {
        ...state,
        notifications: newNotifications,
        offset: newOffset,
      };

    case "UPDATE_NOTIFICATION":
      const notificationId = action.payload.index;
      const updatedNotification = action.payload.notification;

      // updates all fields of notification that are in updatedNotification
      const targetNotification = state.notifications.find(
        (notification) => notification.id === notificationId
      );

      if (!targetNotification) {
        console.log("Notification not found");
        return state;
      }

      Object.keys(updatedNotification).forEach((key) => {
        targetNotification[key] = updatedNotification[key];
      });

      const newNotifications1 = [...state.notifications];

      const notificationUpdated = state.notificationUpdated
        ? state.notificationUpdated + 1
        : 1;

      // serializes notification content.
      // newNotifications1.forEach((notification) => {
      //   notification.content = ReactDOMServer.renderToString(
      //     notification.content
      //   );
      // });

      // // salva o array de notificações no sessionStorage
      // saveNotifications(newNotifications1);

      // retorna o novo array de notificações
      return {
        ...state,
        notifications: newNotifications1,
        notificationUpdated: notificationUpdated,
      };

    case "SERIALIZE_NOTIFICATION":
      const notif = action.payload.notification;
      const notifIndex = action.payload.index;

      // update notif with actual notification fields
      const targetNotif = state.notifications.find(
        (notification) => notification.id === notifIndex
      );

      if (!targetNotif) {
        console.log("Notification not found");
        return state;
      }

      console.log("notif before update keys", notif);

      Object.keys(notif).forEach((key) => {
        notif[key] = targetNotif[key];
      });

      console.log("notif after update keys", notif);
      // serializes notification content if it is a react component
      if (typeof notif.content.type === "function") {
        notif.content = ReactDOMServer.renderToString(notif.content);
      }

      // add  notif to array
      const newNotifications3 = [...state.notifications];
      newNotifications3[notifIndex] = notif;

      console.log("newNotifications3", newNotifications3);

      // salva o array de notificações no sessionStorage
      saveNotifications(newNotifications3);

      // retorna o novo array de notificações

      return {
        ...state,
        notifications: newNotifications3,
      };

    case "REMOVE_NOTIFICATION":
      // remove a notificação do array de notificações
      const newNotifications2 = state.notifications.filter(
        (notification) => notification.id !== action.payload.notification.id
      );

      // salva o array de notificações no sessionStorage
      saveNotifications(newNotifications2);

      // decrements  offset
      const newOffset2 = state.offset - 1;
      sessionStorage.setItem("offset", JSON.stringify(newOffset2));

      // retorna o novo array de notificações
      return {
        ...state,
        notifications: newNotifications2,
        offset: newOffset2,
      };
    default:
      return state;
  }
};

export const NotificationsProvider = ({ children }) => {
  const [stateNotif, dispatchNotif] = useReducer(reducer, initialState);

  return (
    <NotificationsContext.Provider value={{ stateNotif, dispatchNotif }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
